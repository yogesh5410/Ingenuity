import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import { useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setForm((prev) => ({ ...prev, otp: "" })); // clear OTP on email change
    }
  };

  const sendOtp = async () => {
    if (!form.email) return toast.error("Please enter your email");
    setOtpSent(true);
    toast.success("OTP sent to your email");
    try {
      const res = await Axios({
        ...SummaryApi.sendEmail,
        data: { email: form.email },
      });
      if (res.data.success) {
        //
      }
    } catch (error) {
      AxiosToastError(error);
      setOtpSent(false);
    }
  };

  const verifyOtp = async () => {
    if (!form.otp) return toast.error("Please enter OTP");
    try {
      const res = await Axios({
        ...SummaryApi.verifyOtp,
        data: { email: form.email, otp: form.otp },
      });
      if (res.data.success) {
        setOtpVerified(true);
        toast.success("OTP verified");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const resetPassword = async () => {
    if (!otpVerified) return toast.error("Verify OTP first");
    if (!form.newPassword || form.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const res = await Axios({
        ...SummaryApi.resetPassword,
        data: {
          email: form.email,
          newPassword: form.newPassword,
        },
      });
      if (res.data.success) {
        toast.success("Password reset successful! You can login now.");
        navigate("/login");
        // Optionally redirect to login page here
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-100 dark:bg-zinc-700 px-4">
      <div className="mx-2 my-10 max-w-md lg:min-w-md p-6 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl space-y-4 text-zinc-900 dark:text-white">
        <h2 className="text-2xl font-semibold text-center">Reset Your Password</h2>

        {/* Email + Send OTP */}
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="flex-1 p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            disabled={otpVerified}
          />
          <button
            onClick={sendOtp}
            disabled={otpSent || otpVerified || !form.email}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
              otpSent ? "bg-green-600" : "bg-blue-600"
            } disabled:opacity-50`}
          >
            {otpVerified ? "Verified" : "Send OTP"}
          </button>
        </div>

        {/* OTP + Verify */}
        {!otpVerified && otpSent && (
          <div className="flex gap-2">
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="flex-1 p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <button
              onClick={verifyOtp}
              className="cursor-pointer px-4 py-2 rounded-lg text-white bg-blue-400 disabled:opacity-50"
              disabled={!form.otp}
            >
              Verify
            </button>
          </div>
        )}

        {/* New Password */}
        {otpVerified && (
          <>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              onClick={resetPassword}
              disabled={
                !form.newPassword ||
                form.newPassword.length < 6 ||
                form.newPassword !== form.confirmPassword
              }
              className={`w-full py-2 rounded-lg font-semibold transition ${
                form.newPassword &&
                form.confirmPassword &&
                form.newPassword === form.confirmPassword
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
