import express from "express";
import mongoose from "mongoose";
import path from "path";

import WeddingAttendance from "../models/WeddingAttendance";

// import { googleClient } from "../helpers/google";

const router = express.Router();
const VIEW_FOLDER = `${__dirname}/../../static/views`;

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

// router.route("/oauth2callback").get((req, res) => {
// 	console.log(req.body);
// 	console.log(req.query);
// 	console.log(req.params);
// 	console.log(googleClient);
// });

export default router;
