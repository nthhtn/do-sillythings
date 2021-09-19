import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { hashPassword, generateSalt } from '../helpers/encryption';

import User from '../models/User';

const router = express.Router();

passport.use(new Strategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true },
	async (req, username, password, done) => {
		const user = await User.findOne({ username });
		if (user.password !== hashPassword(password, user.salt)) {
			return done(null, false, { success: false, error: 'Invalid username/password' });
		}
		return done(null, user);
	}));

router.route('/login')
	.post(async (req, res) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) { return res.status(500).json({ success: false, error: err.message }); }
			if (!user) { return res.status(401).json(info); }
			req.login(user, (err) => {
				if (err) { return res.status(500).json({ success: false, error: err.message }); }
				return res.json({ success: true });
			});
		})(req, res);
	});

export default router;
