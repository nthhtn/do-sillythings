'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const VIDEO_PATH = path.resolve(__dirname, '../static/img/wedding/slide.mp4');
const BLOB_PATHNAME = 'wedding/video/slide.mp4';

async function run() {
	const stat = fs.statSync(VIDEO_PATH);

	// Guard against re-uploading the Git LFS pointer stub instead of the real video.
	if (stat.size < 1024 * 1024) {
		const head = fs.readFileSync(VIDEO_PATH, { encoding: 'utf8', flag: 'r' }).slice(0, 200);
		if (head.startsWith('version https://git-lfs.github.com/spec/v1')) {
			console.error(`Refusing to upload: ${VIDEO_PATH} is a Git LFS pointer stub (${stat.size} bytes), not the real video.`);
			process.exit(1);
		}
	}

	console.log(`Uploading ${VIDEO_PATH} (${(stat.size / 1024 / 1024).toFixed(1)} MB) to ${BLOB_PATHNAME} ...`);

	const blob = await put(BLOB_PATHNAME, fs.createReadStream(VIDEO_PATH), {
		access: 'public',
		contentType: 'video/mp4',
		multipart: true
	});

	console.log(`Done: ${blob.url}`);
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
