import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },

  otp: {
    type: String,
    required: true
  },

  otp_expire_time: {
    type: Date,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const OTPVerification = mongoose.model('OTPVerification', otpVerificationSchema);
export default OTPVerification;
