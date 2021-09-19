export function isLoggedIn (req, res, next) {
	return req.isAuthenticated() ? next() : res.status(401).json({ success: false, error: 'Invalid session' });
};

export function isNotLoggedIn (req, res, next) {
	return req.isUnauthenticated() ? next() : res.status(402).json({ success: false, error: 'Invalid session' });
}
