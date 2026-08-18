import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import bluebird from 'bluebird';
import { put } from '@vercel/blob';

import Article from '../models/Article'
import Tag from '../models/Tag';
import Category from '../models/Category';
import { encrypt, decrypt, truncateEncrypted } from '../helpers/encryption';
import { encryptId, isLoggedIn } from '../helpers/middleware';

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 4 * 1024 * 1024 }
});

const router = express.Router();

router.route('/')
	.post(
		(req, res, next) => isLoggedIn(req, res, next),
		upload.single('file'),
		async (req, res) => {
			const { title, content, categoryId, tags } = req.body;
			const id = mongoose.isValidObjectId(req.body._id) ? mongoose.Types.ObjectId(req.body._id) : mongoose.Types.ObjectId();

			// UPLOAD COVER IMAGE

			const ext = req.file.originalname.split('.').pop();
			const encrypted_filename = truncateEncrypted(encrypt(req.file.originalname + Date.now().toString())) + '.' + ext;

			const blob = await put(`article/${id}/cover/${encrypted_filename}`, req.file.buffer, {
				access: 'public',
				contentType: req.file.mimetype
			});

			const fields = {
				_id: id,
				title,
				content,
				coverImg: blob.url,
				categoryId,
				authorId: req.user._id
			};
			let article = new Article(fields);
			await article.save();
			let newTags = [];

			// HANDLE TAGS

			await bluebird.map(JSON.parse(tags), async (tag) => {
				const newTag = await Tag.findOneAndUpdate({ tagValue: tag }, { $addToSet: { articles: article._id } }, { upsert: true, new: true });
				newTags.push(newTag);
			});
			article = await Article.findByIdAndUpdate(article._id, { tags: newTags.map((item) => (item._id)) }, { new: true });

			return res.json({ success: true, result: article });
		})
	.get(async (req, res) => {
		const page = req.query.page ? Number(req.query.page) : 1;
		const limit = req.query.limit ? Number(req.query.limit) : 5;
		let filter_options = Object.assign({});
		if (req.query.categoryId) {
			filter_options.categoryId = req.query.categoryId
		}
		const result = await Article.find(filter_options).sort({ createdAt: -1 })
			.skip((page - 1) * limit).limit(limit)
			.populate({ path: 'authorId', select: ['fullName', 'avatar'] })
			.populate({ path: 'categoryId', select: 'displayName' })
			.exec();
		const count = await Article.countDocuments({});
		return res.json({ success: true, result, count });
	});

router.route('/title/:title')
	.get(async (req, res) => {
		const article = await Article.findOne({ title: req.params.title })
			.populate({ path: 'tags', select: 'tagValue' })
			.populate({ path: 'authorId', select: ['fullName', 'brief', 'avatar'] })
			.populate({ path: 'categoryId', select: 'displayName' })
			.exec();
		return res.json({ success: true, result: article });
	});

router.route('/category/:category')
	.get(async (req, res) => {
		const page = req.query.page ? Number(req.query.page) : 1;
		const limit = req.query.limit ? Number(req.query.limit) : 5;
		const category = await Category.findOne({ displayName: req.params.category });
		const result = await Article.find({ categoryId: category._id }).sort({ createdAt: -1 })
			.skip((page - 1) * limit).limit(limit)
			.populate({ path: 'authorId', select: 'fullName' })
			.populate({ path: 'categoryId', select: 'displayName' })
			.exec();
		const count = await Article.countDocuments({ categoryId: category._id });
		return res.json({ success: true, result, count });
	});

router.route('/search')
	.get(async (req, res) => {
		const page = req.query.page ? Number(req.query.page) : 1;
		const limit = req.query.limit ? Number(req.query.limit) : 5;
		let filterOptions = Object.assign({});
		if (req.query.category) {
			const categoryIds = (req.query.category || '').split(',');
			filterOptions.categoryId = { $in: categoryIds };
		}
		if (req.query.keyword) {
			const keyword = req.query.keyword || '';
			const regexFilter = { $regex: new RegExp(keyword, 'gi') };
			filterOptions['$or'] = [{ title: regexFilter }, { content: regexFilter }];
		}
		const result = await Article.find(filterOptions)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit).limit(limit)
			.populate({ path: 'authorId', select: 'fullName' })
			.populate({ path: 'categoryId', select: 'displayName' })
			.exec();
		const count = await Article.countDocuments(filterOptions);
		return res.json({ success: true, result, count });
	});


router.route('/upload-image')
	.post(
		(req, res, next) => isLoggedIn(req, res, next),
		upload.single('file'),
		async (req, res) => {
			if (!mongoose.isValidObjectId(req.body.article_id)) {
				return res.status(400).json({ success: false, error: 'Missing or invalid article_id' });
			}
			const ext = req.file.originalname.split('.').pop();
			const encrypted_filename = truncateEncrypted(encrypt(req.file.originalname + Date.now().toString())) + '.' + ext;
			const blob = await put(`article/${req.body.article_id}/content/${encrypted_filename}`, req.file.buffer, {
				access: 'public',
				contentType: req.file.mimetype
			});
			return res.json({ success: true, url: blob.url });
		});

router.route('/:id')
	.get(
		// (req, res, next) => encryptId(req, res, next),
		async (req, res) => {
			const article = await Article.findOne({ _id: req.params.id }).populate({ path: 'tags', select: 'tagValue' }).exec();
			return res.json({ success: true, result: article });
		})
	.put(
		(req, res, next) => isLoggedIn(req, res, next),
		upload.single('file'),
		async (req, res) => {
			const tags = !Array.isArray(req.body.tags) ? JSON.parse(req.body.tags) : req.body.tags;
			// const objectId = decrypt(req.params.id);
			const objectId = req.params.id;
			let article = await Article.findOne({ _id: objectId }).populate({ path: 'tags', select: 'tagValue' }).exec();
			// HANDLE TAGS
			const removeTags = article.tags.filter((tag) => !tags.includes(tag.tagValue));
			const conditions = { tagValue: { $in: removeTags.map((tag) => (tag.tagValue)) } };
			const options = { $pull: { articles: { $in: [mongoose.Types.ObjectId(objectId)] } } };
			await Tag.updateMany(conditions, options);
			let addTags = [];
			await bluebird.map(tags, async (tag) => {
				const newTag = await Tag.findOneAndUpdate({ tagValue: tag }, { $addToSet: { articles: objectId } }, { upsert: true, new: true });
				addTags.push(newTag);
			});

			let data = { ...req.body, tags: addTags.map((item) => (item._id)) };
			// UPLOAD COVER IMAGE
			if (req.file) {
				const ext = req.file.originalname.split('.').pop();
				const encrypted_filename = truncateEncrypted(encrypt(req.file.originalname + Date.now().toString())) + '.' + ext;

				const blob = await put(`article/${objectId}/cover/${encrypted_filename}`, req.file.buffer, {
					access: 'public',
					contentType: req.file.mimetype
				});

				data.coverImg = blob.url;
			}

			article = await Article.findByIdAndUpdate(article._id, data, { new: true })
				.populate({ path: 'tags', select: 'tagValue' })
				.populate({ path: 'authorId', select: ['fullName', 'brief', 'avatar'] })
				.populate({ path: 'categoryId', select: 'displayName' })

			return res.json({ success: true, result: article });
		})
	.delete(async (req, res) => {
		// const objectId = decrypt(req.params.id);
	});

export default router;
