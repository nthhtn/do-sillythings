'use strict';

require('dotenv').config();

const { list, del } = require('@vercel/blob');

const KEEP_PATHNAME = 'wedding/video/slide.mp4';
const PREFIX = 'wedding/';
const CHUNK_SIZE = 50;

function chunk(array, size) {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

async function run() {
	let cursor;
	const toDelete = [];

	do {
		const result = await list({ prefix: PREFIX, cursor, limit: 1000 });
		for (const blob of result.blobs) {
			if (blob.pathname !== KEEP_PATHNAME) {
				toDelete.push(blob.url);
			}
		}
		cursor = result.hasMore ? result.cursor : undefined;
	} while (cursor);

	console.log(`Found ${toDelete.length} blobs under "${PREFIX}" to delete (keeping ${KEEP_PATHNAME}).`);

	for (const batch of chunk(toDelete, CHUNK_SIZE)) {
		await del(batch);
		console.log(`Deleted ${batch.length} blobs.`);
	}

	console.log('Done.');
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
