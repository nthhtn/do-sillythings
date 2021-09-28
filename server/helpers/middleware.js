import { encrypt, decrypt } from './encryption';

export function isLoggedIn(req, res, next) {
	return req.isAuthenticated() ? next() : res.status(401).json({ success: false, error: 'Invalid session' });
};

export function isNotLoggedIn(req, res, next) {
	return req.isUnauthenticated() ? next() : res.status(402).json({ success: false, error: 'Invalid session' });
};

export function encryptId(req, res, next) {
	if (req.params.id) {
		console.log(req.params.id);
		console.log(encrypt(req.params.id));
	}
	return next();
};

export function decryptId(req, res, next) {
	if (req.params.id) {
		console.log(req.params.id);
		console.log(decrypt(req.params.id));
	}
	return next();
};
