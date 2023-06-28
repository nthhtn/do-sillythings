import mongoose from "mongoose";

const weddingAttendanceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	quantity: {
		type: Number,
	},
	venue: {
		type: Number,
	},
});

export default mongoose.model("WeddingAttendance", weddingAttendanceSchema);
