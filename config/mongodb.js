require('dotenv').config();

module.exports = {
	DB_URL: process.env.MONGODB_URL,
	DB_NAME: process.env.MONGODB_NAME
};
