import express from 'express';

const router = express.Router();

router.route('/me')
	.get(async (req, res) => {
		if (!req.user) {
			return res.json({ success: false, error: 'User not logged in' });
		}
		const { _id, username, email, fullName } = req.user;
		return res.json({ success: true, result: { _id, username, email, fullName } });
	});

export default router;
