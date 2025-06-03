import mongoose from 'mongoose';

const hintSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    penalty: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });

const potdSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    problemLink: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        enum: ['Codeforces', 'LeetCode'],
        required: true,
    },
    hints: {
        type: [hintSchema],
        default: [],
    }
}, { timestamps: true });

const PotdModel = mongoose.model('Potd', potdSchema);
export default PotdModel;
