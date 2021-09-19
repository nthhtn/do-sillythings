import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    tagValue: {
        type: String,
        required: true,
        unique: true
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }]
});

export default mongoose.model('Tag', tagSchema);