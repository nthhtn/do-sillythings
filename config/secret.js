require('dotenv').config();

module.exports = {
	SESSION_SECRET: process.env.SESSION_SECRET,
	ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
	ENCRYPTION_RANDOM: process.env.ENCRYPTION_RANDOM
};
