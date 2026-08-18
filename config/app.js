require('dotenv').config();

module.exports = {
	APP_PORT: process.env.APP_PORT || 4000,
	NODE_ENV: process.env.NODE_ENV || 'development'
};
