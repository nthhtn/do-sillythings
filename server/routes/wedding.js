import express from "express";
import mongoose from "mongoose";
import path from "path";
import { head } from "@vercel/blob";

import WeddingAttendance from "../models/WeddingAttendance";

// import { googleClient } from "../helpers/google";

const router = express.Router();
const VIEW_FOLDER = path.join(process.cwd(), 'static/views');
const GALLERY_FOLDER = path.join(process.cwd(), 'static/img/wedding/gallery/compressed');
const GALLERY_URL_PREFIX = "/assets/img/wedding/gallery/compressed";

const WEDDING_VIDEO_BLOB_PATHNAME = "wedding/video/slide.mp4";
let cachedVideoUrl = null;

router.route("/").get((req, res) => {
	const viewpath = path.resolve(VIEW_FOLDER, "wedding.html");
	return res.sendFile(viewpath);
});

router
	.route("/attendance")
	.get(async (req, res) => {
		const count = await WeddingAttendance.countDocuments();
		const list = await WeddingAttendance.find({}).sort({venue: 1});
		return res.json({ count, list });
	})
	.post(async (req, res) => {
		const { name, quantity, venue } = req.body;
		const id = mongoose.Types.ObjectId();
		const fields = {
			_id: id,
			name,
			// email,
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

router.route("/video").get(async (req, res, next) => {
	try {
		if (!cachedVideoUrl) {
			const blob = await head(WEDDING_VIDEO_BLOB_PATHNAME);
			cachedVideoUrl = blob.url;
		}
		return res.redirect(302, cachedVideoUrl);
	} catch (err) {
		return next(err);
	}
});

export default router;
