'use strict';

require('dotenv').config();
require('@babel/register');

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { put } = require('@vercel/blob');

const { MONGODB_URL } = require('../config/mongodb');
const { encrypt, truncateEncrypted } = require('../server/helpers/encryption');
const Article = require('../server/models/Article').default;
const User = require('../server/models/User').default;

const UPLOAD_FOLDER = path.resolve(__dirname, '../uploads');

const MIME_EXT = {
	'jpeg': 'jpg', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif', 'webp': 'webp', 'svg+xml': 'svg'
};

const DATA_URI_REGEX = /data:image\/([a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/g;

function encryptedFilename(originalName) {
	const ext = originalName.split('.').pop();
	return `${truncateEncrypted(encrypt(originalName + Date.now().toString()))}.${ext}`;
}

async function uploadLocalFile(relativePath, folderPrefix) {
	const absolutePath = path.resolve(UPLOAD_FOLDER, relativePath.replace(/^\/?uploads\//, ''));
	const buffer = fs.readFileSync(absolutePath);
	const filename = encryptedFilename(path.basename(absolutePath));
	const blob = await put(`${folderPrefix}/${filename}`, buffer, { access: 'public' });
	return blob.url;
}

async function migrateContentImages(article) {
	const matches = [...article.content.matchAll(DATA_URI_REGEX)];
	if (matches.length === 0) { return null; }

	const uniqueDataUris = [...new Set(matches.map((m) => m[0]))];
	let newContent = article.content;
	for (const fullMatch of uniqueDataUris) {
		const parsed = fullMatch.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
		const [, subtype, base64Data] = parsed;
		const ext = MIME_EXT[subtype.toLowerCase()] || 'jpg';
		const buffer = Buffer.from(base64Data, 'base64');
		const filename = encryptedFilename(`inline.${ext}`);
		const blob = await put(`article/${article._id}/content/${filename}`, buffer, {
			access: 'public',
			contentType: `image/${subtype}`
		});
		newContent = newContent.split(fullMatch).join(blob.url);
	}
	return newContent;
}

async function run() {
	await mongoose.connect(MONGODB_URL, {});

	// 1. Article cover images: local /uploads path -> blob
	const articlesWithLocalCover = await Article.find({ coverImg: { $regex: '^/uploads/' } });
	for (const article of articlesWithLocalCover) {
		const oldPath = article.coverImg;
		try {
			const newUrl = await uploadLocalFile(oldPath, `article/${article._id}/cover`);
			await Article.updateOne({ _id: article._id }, { coverImg: newUrl });
			console.log(`[cover] article ${article._id}: ${oldPath} -> ${newUrl}`);
		} catch (err) {
			console.error(`[cover] article ${article._id}: FAILED (${oldPath}) - ${err.message}`);
		}
	}

	// 2. Article content: embedded base64 images -> blob, replace in content
	const allArticles = await Article.find({});
	for (const article of allArticles) {
		try {
			const newContent = await migrateContentImages(article);
			if (newContent) {
				await Article.updateOne({ _id: article._id }, { content: newContent });
				console.log(`[content] article ${article._id}: migrated inline images`);
			}
		} catch (err) {
			console.error(`[content] article ${article._id}: FAILED - ${err.message}`);
		}
	}

	// 3. User avatars: local /uploads path -> blob
	const usersWithLocalAvatar = await User.find({ avatar: { $regex: '^/uploads/' } });
	for (const user of usersWithLocalAvatar) {
		const oldPath = user.avatar;
		try {
			const newUrl = await uploadLocalFile(oldPath, `user/${user._id}/avatar`);
			await User.updateOne({ _id: user._id }, { avatar: newUrl });
			console.log(`[avatar] user ${user._id}: ${oldPath} -> ${newUrl}`);
		} catch (err) {
			console.error(`[avatar] user ${user._id}: FAILED (${oldPath}) - ${err.message}`);
		}
	}

	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
