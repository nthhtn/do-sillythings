import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import webpack from 'webpack';
import passport from 'passport';

import webpack_config from './webpack.config';
import { MONGODB_URL } from './config/mongodb';
import { APP_PORT, NODE_ENV } from './config/app';
import { SESSION_SECRET } from './config/secret';
import { connectToDatabase } from './server/db';

const isProd = NODE_ENV === 'production';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static(`${__dirname}/static`));
app.use('/favicon.ico', express.static(`${__dirname}/static/img/favicon.ico`));

if (!isProd) {
	app.use('/uploads', express.static(`${__dirname}/uploads`));
}

app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({ mongoUrl: MONGODB_URL, touchAfter: 24 * 3600 })
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	return done(null, user);
});

passport.deserializeUser((user, done) => {
	return done(null, user);
});

app.use(morgan('dev'));

if (isProd) {
	app.use('/static', express.static(`${__dirname}/dist`));
} else {
	const compiler = webpack(webpack_config);
	app.use(require('webpack-dev-middleware')(compiler, {
		publicPath: webpack_config.output.publicPath
	}));
	app.use(require('webpack-hot-middleware')(compiler));
}

app.use(async (req, res, next) => {
	try {
		await connectToDatabase();
		return next();
	} catch (err) {
		return next(err);
	}
});

require('./server')(app);

if (!isProd) {
	app.listen(APP_PORT, () => console.log(`App is listening on port ${APP_PORT}`));
}

module.exports = app;
