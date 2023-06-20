import mongoose from 'mongoose';

const weddingAttendanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    quantity: {
        type: String
    },
    venue: {
        type: Number
    },
});

export default mongoose.model('WeddingAttendance', weddingAttendanceSchema);
