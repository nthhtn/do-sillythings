import crypto from 'crypto';

import { ENCRYPTION_SECRET, ENCRYPTION_RANDOM } from '../../config/secret';

const SALT_LENGTH = 32;
const TRUNCATED_LENGTH = 10;
const PASSWORD_HASH_ALG = 'sha512';
const ID_ENCRYPTION_ALG = 'aes-256-ctr';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest('base64').substr(0, 32);
const ENCRYPTION_IV = Buffer.from(ENCRYPTION_RANDOM, 'hex');

export function hashPassword(password, salt) {
	let hash = crypto.createHmac(PASSWORD_HASH_ALG, salt);
	hash.update(password);
	return hash.digest('hex');
};

export function generateSalt() {
	return crypto.randomBytes(SALT_LENGTH).toString('hex');
};

export function encrypt(id) {
	const cipher = crypto.createCipheriv(ID_ENCRYPTION_ALG, ENCRYPTION_KEY, ENCRYPTION_IV);
	return Buffer.concat([cipher.update(id), cipher.final()]).toString('hex');
};

export function decrypt(encrypted_id) {
	const decipher = crypto.createDecipheriv(ID_ENCRYPTION_ALG, ENCRYPTION_KEY, ENCRYPTION_IV);
	return Buffer.concat([decipher.update(Buffer.from(encrypted_id, 'hex')), decipher.final()]).toString();
};

export function truncateEncrypted(text) {
	return text.substring(text.length - TRUNCATED_LENGTH).toUpperCase();
};
