'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const WEDDING_IMG_FOLDER = path.resolve(__dirname, '../static/img/wedding');
const WEDDING_HTML_PATH = path.resolve(__dirname, '../static/views/wedding.html');
const EXCLUDE = new Set(['slide.mp4']);
const CONCURRENCY = 8;

const CONTENT_TYPE_BY_EXT = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png'
};

function listFilesRecursive(dir) {
	let results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results = results.concat(listFilesRecursive(fullPath));
		} else if (!EXCLUDE.has(entry.name)) {
			results.push(fullPath);
		}
	}
	return results;
}

async function runPool(items, worker, concurrency) {
	const results = new Array(items.length);
	let index = 0;
	async function next() {
		while (index < items.length) {
			const current = index++;
			results[current] = await worker(items[current], current);
		}
	}
	await Promise.all(Array.from({ length: concurrency }, next));
	return results;
}

async function run() {
	const files = listFilesRecursive(WEDDING_IMG_FOLDER);
	console.log(`Found ${files.length} files to migrate.`);

	const urlMap = new Map(); // old relative-url path -> new blob url

	await runPool(files, async (absolutePath, i) => {
		const relativePath = path.relative(WEDDING_IMG_FOLDER, absolutePath).split(path.sep).join('/');
		const ext = path.extname(absolutePath).toLowerCase();
		const buffer = fs.readFileSync(absolutePath);
		const blob = await put(`wedding/${relativePath}`, buffer, {
			access: 'public',
			contentType: CONTENT_TYPE_BY_EXT[ext] || 'application/octet-stream'
		});
		urlMap.set(`/assets/img/wedding/${relativePath}`, blob.url);
		console.log(`[${i + 1}/${files.length}] ${relativePath} -> ${blob.url}`);
	}, CONCURRENCY);

	console.log('Rewriting wedding.html ...');
	let html = fs.readFileSync(WEDDING_HTML_PATH, 'utf8');
	let replacedCount = 0;
	for (const [oldPath, newUrl] of urlMap) {
		// Longest-first: the bare path is a substring of the absolute URLs, so it
		// must be replaced last or it mangles the absolute variants mid-string.
		const variants = [
			`https://do-sillythings.com${oldPath}`,
			`http://do-sillythings.com${oldPath}`,
			oldPath
		];
		for (const variant of variants) {
			if (html.includes(variant)) {
				html = html.split(variant).join(newUrl);
				replacedCount++;
			}
		}
	}
	fs.writeFileSync(WEDDING_HTML_PATH, html);
	console.log(`Replaced ${replacedCount} URL occurrences in wedding.html.`);
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
