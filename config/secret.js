require('dotenv').config();

module.exports = {
	SESSION_SECRET: process.env.SESSION_SECRET,
	ENCRYPTION_KEY: process.env.ENCRYPTION_SECRET
};
