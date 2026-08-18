import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { put } from '@vercel/blob';

import User from '../models/User';
import { isLoggedIn } from '../helpers/middleware';
import { encrypt, decrypt, hashPassword, truncateEncrypted } from '../helpers/encryption';

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 4 * 1024 * 1024 }
});

const router = express.Router();

router.use((req, res, next) => isLoggedIn(req, res, next));

router.route('/me')
	.get(async (req, res) => {
		const { _id, username, email, fullName, brief, avatar } = req.user;
		return res.json({ success: true, result: { username, email, fullName, brief, avatar } });
	})
	.put(
		upload.single('file'),
		async (req, res) => {
			const { _id, salt, password } = req.user;
			const { fullName, brief, oldpass, newpass } = req.body;
			let data = { fullName, brief };
			if (oldpass && newpass) {
				if (hashPassword(oldpass, salt) != password) {
					return res.status(400).json({ success: false, error: 'Wrong current password!' });
				}
				data.password = hashPassword(newpass, salt);
			}

			if (req.file) {
				const ext = req.file.originalname.split('.').pop();
				const encrypted_filename = truncateEncrypted(encrypt(req.file.originalname + Date.now().toString())) + '.' + ext;

				const blob = await put(`user/${_id}/avatar/${encrypted_filename}`, req.file.buffer, {
					access: 'public',
					contentType: req.file.mimetype
				});

				data.avatar = blob.url;
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

			req.login(session_data, (err) => {
				return res.json({ success: true, result: returnedResult });
			});
		});

export default router;
