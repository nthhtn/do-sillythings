import path from 'path';

import CategoryRouter from './routes/category';
import UserRouter from './routes/user';
import ArticleRouter from './routes/article';
import UnauthenticatedRouter from './routes/unauthenticated';
import { generateCategories } from './helpers/initializer';

const VIEW_FOLDER = `${__dirname}/../static/views`;

module.exports = async (app, db) => {

	await generateCategories();

	app.use('/api/categories', CategoryRouter);
	app.use('/api/users', UserRouter);
	app.use('/api/articles', ArticleRouter);

	app.use('/', UnauthenticatedRouter);

	app.route('/logout')
		.get((req, res) => {
			if (req.isAuthenticated()) { req.logOut(); }
			return res.sendFile(path.resolve(VIEW_FOLDER, 'guest.html'));
		});

	app.route('/dashboard/*')
		.get(async (req, res) => {
			const viewpath = path.resolve(VIEW_FOLDER, req.isAuthenticated() ? 'dashboard.html' : 'guest.html');
			return res.sendFile(viewpath);
		});

	app.route('/dashboard')
		.get(async (req, res) => {
			const viewpath = path.resolve(VIEW_FOLDER, req.isAuthenticated() ? 'dashboard.html' : 'guest.html');
			return res.sendFile(viewpath);
		});

	app.route('*')
		.get((req, res) => {
			const viewpath = path.resolve(VIEW_FOLDER, 'guest.html');
			return res.sendFile(viewpath);
		});

};
