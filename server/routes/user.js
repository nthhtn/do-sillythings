import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

import User from '../models/User';
import { isLoggedIn } from '../helpers/middleware';
import { encrypt, decrypt, hashPassword, truncateEncrypted } from '../helpers/encryption';

const UPLOAD_FOLDER = `${__dirname}/../../uploads`;

const router = express.Router();

router.use((req, res, next) => isLoggedIn(req, res, next));

router.route('/me')
	.get(async (req, res) => {
		const { _id, username, email, fullName, brief, avatar } = req.user;
		return res.json({ success: true, result: { username, email, fullName, brief, avatar } });
	})
	.put(
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
			const { _id, salt, password } = req.user;
			const { fullName, brief, oldpass, newpass } = req.body;
			let data = { fullName, brief };
			if (oldpass && newpass) {
				console.log(password);
				console.log(hashPassword(oldpass, salt));
				console.log(hashPassword(oldpass, salt) == password);
				console.log(hashPassword(oldpass, salt) != password);
				console.log(hashPassword(oldpass, salt) !== password);
				if (hashPassword(oldpass, salt) != password) {
					return res.status(400).json({ success: false, error: 'Wrong current password!' });
				}
				data.password = hashPassword(newpass, salt);
			}

			const encryptedId = truncateEncrypted(encrypt(_id));
			if (req.file) {
				const filename = req.file.filename;
				const ext = filename.split('.').pop();
				const encrypted_filename = truncateEncrypted(encrypt(filename + Date.now().toString())) + '.' + ext;

				const oldpath = path.resolve(UPLOAD_FOLDER, 'img/tmp', req.file.filename);
				const newpath = path.resolve(UPLOAD_FOLDER, `img/users/${encryptedId}/${encrypted_filename}`);

				mkdirp.sync(path.resolve(UPLOAD_FOLDER, `img/users/${encryptedId}`));
				fs.renameSync(oldpath, newpath);

				data.avatar = `/uploads/img/users/${encryptedId}/${encrypted_filename}`;
			}

			const result = await User.findByIdAndUpdate(_id, data);

			let returnedResult = { fullName, brief };
			if (!!data.avatar) {
				returnedResult.avatar = data.avatar;
			}

			let session_data = { ...req.user, ...returnedResult };
			if (data.password) {
				session_data.password = data.password;
			}

			console.log('Before');
			console.log(req.user);

			console.log('Data');
			console.log(session_data);

			req.login(session_data, (err) => {
				console.log('After');
				console.log(req.user);
				return res.json({ success: true, result: returnedResult });
			});
		});

export default router;
