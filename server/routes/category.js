import express from 'express';

import Category from '../models/Category';

const router = express.Router();

router.route('/')
	.get(async (req, res) => {
		const result = await Category.find({}).exec();
		return res.json({ success: true, result });
	});

export default router;
