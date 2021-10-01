import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import bluebird from 'bluebird';
import fs from 'fs';
import mkdirp from 'mkdirp';

import Article from '../models/Article'
import Tag from '../models/Tag';
import Category from '../models/Category';
import { encrypt, decrypt, truncateEncrypted } from '../helpers/encryption';
import { encryptId, isLoggedIn } from '../helpers/middleware';

const UPLOAD_FOLDER = `${__dirname}/../../uploads`;

const router = express.Router();

router.route('/')
	.post(
		(req, res, next) => isLoggedIn(req, res, next),
		multer({
			storage: multer.diskStorage({
				destination: path.resolve(UPLOAD_FOLDER, 'img/tmp'),
				filename: (req, file, callback) => {
					const imageId = mongoose.Types.ObjectId();
					const filename = file.originalname;
					const ext = filename.split('.').pop();
					return callback(null, `${imageId}.${ext}`);
				}
			})
		}).single('file'),
		async (req, res) => {
			const { title, content, categoryId, tags } = req.body;
			const id = mongoose.Types.ObjectId();
			const encryptedId = truncateEncrypted(encrypt(id.toString()));

			// UPLOAD COVER IMAGE

			const filename = req.file.filename;
			const ext = filename.split('.').pop();
			const encrypted_filename = truncateEncrypted(encrypt(filename + Date.now().toString())) + '.' + ext;

			const oldpath = path.resolve(UPLOAD_FOLDER, 'img/tmp', req.file.filename);
			const newpath = path.resolve(UPLOAD_FOLDER, `img/articles/${encryptedId}/cover/${encrypted_filename}`);

			mkdirp.sync(path.resolve(UPLOAD_FOLDER, `img/articles/${encryptedId}/cover`));
			fs.renameSync(oldpath, newpath);

			const fields = {
				_id: id,
				title,
				content,
				coverImg: `/uploads/img/articles/${encryptedId}/cover/${encrypted_filename}`,
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
			.populate({ path: 'authorId', select: 'fullName' })
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


router.route('/:id')
	.get(
		// (req, res, next) => encryptId(req, res, next),
		async (req, res) => {
			// console.log(req.params.id);
			// const objectId = decrypt(req.params.id);
			// console.log(objectId);
			const article = await Article.findOne({ _id: req.params.id }).populate({ path: 'tags', select: 'tagValue' }).exec();
			// console.log(article);
			return res.json({ success: true, result: article });
		})
	.put(
		(req, res, next) => isLoggedIn(req, res, next),
		multer({
			storage: multer.diskStorage({
				destination: path.resolve(UPLOAD_FOLDER, 'img/tmp'),
				filename: (req, file, callback) => {
					const imageId = mongoose.Types.ObjectId();
					const filename = file.originalname;
					const ext = filename.split('.').pop();
					return callback(null, `${imageId}.${ext}`);
				}
			})
		}).single('file'),
		async (req, res) => {
			const { tags } = req.body;
			console.log(tags);
			// const objectId = decrypt(req.params.id);
			const objectId = req.params.id;
			let article = await Article.findOne({ _id: objectId }).populate({ path: 'tags', select: 'tagValue' }).exec();
			// HANDLE TAGS
			const removeTags = article.tags.filter((tag) => !tags.includes(tag.tagValue));
			// console.log(removeTags);
			const conditions = { tagValue: { $in: removeTags.map((tag) => (tag.tagValue)) } };
			// console.log(conditions);
			const options = { $pull: { articles: { $in: [mongoose.Types.ObjectId(objectId)] } } };
			const matchedTags = await Tag.find(conditions);
			// console.log(matchedTags);
			const removed = await Tag.updateMany(conditions, options);
			// console.log(removed);
			let addTags = [];
			await bluebird.map(tags, async (tag) => {
				const newTag = await Tag.findOneAndUpdate({ tagValue: tag.tagValue }, { $addToSet: { articles: objectId } }, { upsert: true, new: true });
				addTags.push(newTag);
			});

			let data = { ...req.body, tags: addTags.map((item) => (item._id)) };
			console.log(data);
			// UPLOAD COVER IMAGE
			console.log(req.file);
			if (req.file) {
				const encryptedId = truncateEncrypted(encrypt(objectId));
				const filename = req.file.filename;
				const ext = filename.split('.').pop();
				const encrypted_filename = truncateEncrypted(encrypt(filename + Date.now().toString())) + '.' + ext;

				const oldpath = path.resolve(UPLOAD_FOLDER, 'img/tmp', req.file.filename);
				const newpath = path.resolve(UPLOAD_FOLDER, `img/articles/${encryptedId}/cover/${encrypted_filename}`);

				mkdirp.sync(path.resolve(UPLOAD_FOLDER, `img/articles/${encryptedId}/cover`));
				fs.renameSync(oldpath, newpath);

				data.coverImg = `/uploads/img/articles/${encryptedId}/cover/${encrypted_filename}`;
			}

			console.log(data);

			article = await Article.findByIdAndUpdate(article._id, data, { new: true });
			return res.json({ success: true, result: article });
		})
	.delete(async (req, res) => {
		// const objectId = decrypt(req.params.id);
	});

export default router;
