import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import webpack from 'webpack';
import mongoose from 'mongoose';
import passport from 'passport';

import { DB_URL, DB_NAME } from './config/mongodb';
import { APP_PORT, APP_MODE } from './config/app';
import { SESSION_SECRET } from './config/secret';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static(`${__dirname}/static`));
app.use('/uploads', express.static(`${__dirname}/uploads`));

app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	// console.log('serialize');
	return done(null, user);
});

passport.deserializeUser((user, done) => {
	// console.log('deserialize');
	return done(null, user);
});

app.use(morgan('dev'));

import webpack_config from './webpack.config';
const compiler = webpack(webpack_config);
app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: webpack_config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

mongoose.connect(DB_URL, {}, async (err, client) => {
	if (err) { throw err; }
	const db = null;
	require('./server')(app, db);
	app.listen(APP_PORT, () => console.log(`App is listening on port ${APP_PORT}`));
});
