import mongoose from 'mongoose';

import { MONGODB_URL } from '../config/mongodb';
import { generateCategories } from './helpers/initializer';

let cached = global.__mongooseConn || (global.__mongooseConn = { conn: null, promise: null, seeded: false });

export async function connectToDatabase() {
	if (cached.conn) { return cached.conn; }
	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URL, { bufferCommands: false });
	}
	cached.conn = await cached.promise;

	if (!cached.seeded) {
		cached.seeded = true;
		await generateCategories();
	}

	return cached.conn;
};
