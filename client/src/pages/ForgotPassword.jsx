import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import { useNavigate } from "react-router-dom"
import OTPInput from "../components/OTPInput";

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
  const emailRef = useRef(null);
  const newPassRef = useRef(null);
  const verifyBtnRef = useRef(null);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setForm((prev) => ({ ...prev, otp: "" })); // clear OTP on email change
    }
  };

  const sendOtp = async () => {
    if (isSendingOtp || otpVerified) return;
    if (!form.email) return toast.error("Please enter your email");
    setIsSendingOtp(true);
    try {
      const res = await Axios({
        ...SummaryApi.sendEmail,
        data: { email: form.email },
      });
      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      AxiosToastError(error);
      setOtpSent(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (isVerifyingOtp || otpVerified) return;
    if (!form.otp) return toast.error("Please enter OTP");
    if (form.otp.length !== 6) return toast.error("Enter 6-digit OTP");
    setIsVerifyingOtp(true);
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
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resetPassword = async () => {
    if (isResetting) return;
    if (!otpVerified) return toast.error("Verify OTP first");
    if (!form.newPassword || form.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setIsResetting(true);
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
    } finally {
      setIsResetting(false);
    }
  };

  // Enter key handling
  useEffect(() => {
    const listener = (e) => {
      if (e.key !== "Enter") return;
      // avoid double when button is focused (Enter triggers click)
      if (document.activeElement?.tagName?.toLowerCase() === "button") return;
      if (!otpSent) return sendOtp();
      if (otpSent && !otpVerified && form.otp.length === 6 && !isVerifyingOtp) return verifyOtp();
      if (otpVerified) return resetPassword();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpSent, otpVerified, form, isVerifyingOtp]);

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-emerald-50 to-sky-100 dark:from-zinc-800 dark:to-zinc-900 px-4">
      <div className="mx-2 my-10 max-w-md lg:min-w-md p-6 md:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur shadow-xl rounded-2xl space-y-5 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 animate-[fadeIn_300ms_ease-out]">
        <h2 className="text-3xl font-bold text-center text-emerald-700 dark:text-emerald-400">Reset Your Password</h2>

        {/* Email + Send OTP */}
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            ref={emailRef}
            className="flex-1 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            disabled={otpVerified}
          />
          <button
            onClick={sendOtp}
            disabled={isSendingOtp || otpSent || otpVerified || !form.email}
            className={`cursor-pointer px-4 py-2 rounded-xl text-white font-medium shadow-sm transition-all duration-200 ${
              otpSent ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {otpVerified ? "Verified" : isSendingOtp ? "Sending..." : "Send OTP"}
          </button>
        </div>

        {/* OTP + Verify */}
        {!otpVerified && otpSent && (
          <div className="flex flex-col gap-3">
            <OTPInput
              length={6}
              value={form.otp}
              onChange={(v) => setForm((prev) => ({ ...prev, otp: v }))}
              onComplete={() => verifyBtnRef.current?.focus()}
            />
            <button
              onClick={verifyOtp}
              ref={verifyBtnRef}
              className="cursor-pointer px-4 py-2 rounded-xl text-white bg-sky-600 hover:bg-sky-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={form.otp.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {/* New Password */}
        {otpVerified && (
          <>
            <div className="relative animate-[slideUp_250ms_ease-out]">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                ref={newPassRef}
                className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3.5 text-zinc-500 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative animate-[slideUp_300ms_ease-out]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-zinc-500 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              onClick={resetPassword}
              disabled={
                isResetting ||
                !form.newPassword ||
                form.newPassword.length < 6 ||
                form.newPassword !== form.confirmPassword
              }
              className={`w-full py-3 rounded-xl font-semibold transition ${
                form.newPassword &&
                form.confirmPassword &&
                form.newPassword === form.confirmPassword
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow"
                  : "bg-zinc-400 text-white cursor-not-allowed"
              }`}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
