import express from "express";
import mongoose from "mongoose";
import path from "path";

import WeddingAttendance from '../models/WeddingAttendance';

const router = express.Router();
const VIEW_FOLDER = `${__dirname}/../../static/views`;

router.route("/").get((req, res) => {
	const viewpath = path.resolve(VIEW_FOLDER, "wedding.html");
	return res.sendFile(viewpath);
});

router
	.route("/attendance")
	.get((req, res) => {})
	.post((req, res) => {});

export default router;
