import express from "express";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

import WeddingAttendance from "../models/WeddingAttendance";

// import { googleClient } from "../helpers/google";

const router = express.Router();
const VIEW_FOLDER = `${__dirname}/../../static/views`;
const GALLERY_FOLDER = `${__dirname}/../../static/img/wedding/gallery/compressed`;
const GALLERY_URL_PREFIX = "/assets/img/wedding/gallery/compressed";
const WEDDING_FOLDER= `${__dirname}/../../static/img/wedding`;

router.route("/").get((req, res) => {
	const viewpath = path.resolve(VIEW_FOLDER, "wedding.html");
	return res.sendFile(viewpath);
});

router
	.route("/attendance")
	.get(async (req, res) => {
		const count = await WeddingAttendance.countDocuments();
		return res.json({ count });
	})
	.post(async (req, res) => {
		const { name, email, quantity, venue } = req.body;
		const id = mongoose.Types.ObjectId();
		const fields = {
			_id: id,
			name,
			email,
			quantity: parseInt(quantity),
			venue: parseInt(venue),
		};
		let attendance = new WeddingAttendance(fields);
		await attendance.save();
		return res.json({ success: true, result: attendance });
	});

// router.route("/gallery/:galleryIndex").get((req, res) => {
// 	res.setHeader("Content-Type", "text/html");
// 	let html = "";
// 	const { galleryIndex } = req.params;
// 	if (galleryIndex >= 1 && galleryIndex <= 3) {
// 		const folder = GALLERY_FOLDER + "/" + galleryIndex;
// 		const files = fs.readdirSync(folder);
// 		for (let i = 0; i < files.length; i++) {
// 			let imgSrc =
// 				GALLERY_URL_PREFIX + "/" + galleryIndex + "/" + files[i];
// 			html += `<li class="one-third animate-box" data-animate-effect="fadeIn"
// 			style="background-image: url('${imgSrc}'); "></li>`;
// 		}
// 	}
// 	return res.send(html);
// });

router.route("/video").get((req, res) => {
	const range = req.headers.range;
	console.log(range);
	if (!range) {
		res.status(400).send("Requires Range header");
	}
	const videoPath = path.resolve(WEDDING_FOLDER, "slide.mp4");
	const videoSize = fs.statSync(videoPath).size;
	const CHUNK_SIZE = 10 ** 6;
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};
	res.writeHead(206, headers);
	const videoStream = fs.createReadStream(videoPath, { start, end });
	videoStream.pipe(res);
});

// router.route("/oauth2callback").get((req, res) => {
// 	console.log(req.body);
// 	console.log(req.query);
// 	console.log(req.params);
// 	console.log(googleClient);
// });

export default router;
