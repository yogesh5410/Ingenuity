import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ['online', 'offline'],
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  image: {
    type: String, // base64 or image URL
    default: '',
  },
  links: {
    type: [linkSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
