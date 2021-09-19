import crypto from 'crypto';

const SALT_LENGTH = 32;
const PASSWORD_HASH_ALG = 'sha512';

export function hashPassword(password, salt) {
	let hash = crypto.createHmac(PASSWORD_HASH_ALG, salt);
	hash.update(password);
	return hash.digest('hex');
};

export function generateSalt() {
	return crypto.randomBytes(SALT_LENGTH).toString('hex');
};
