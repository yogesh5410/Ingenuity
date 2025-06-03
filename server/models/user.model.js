import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  codeforces_id: String,
  leetcode_id: String,

  refresh_token: {
    type: String,
    default: '',
  },

  last_login_date: {
    type: Date,
    default: null,
  },

  points: {
    type: Number,
    default: 0,
  },

  solvedDates: {
    type: [String], // e.g., ['2025-05-27', '2025-05-28']
    default: [],
  },

  todayHintUnlocks: {
    type: [Number], // hint indexes for today's POTD only
    default: [],
  },

  todayHintDate: {
    type: String, // to clear old data if stale
    default: null, // format: 'YYYY-MM-DD'
  },

  role: {
    type: String,
    enum: ['user', 'ADMIN'],
    default: 'user',
  },

}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
export default UserModel;