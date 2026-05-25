import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import { useNavigate } from "react-router-dom";
import OTPInput from "../components/OTPInput";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    cf_id: "",
    lc_id: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [cfVerified, setCfVerified] = useState(false);
  const [lcVerified, setLcVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailRef = useRef(null);

  const isInstituteEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/.test(email);
  };

    const verifyBtnRef = useRef(null);

    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isVerifyingCf, setIsVerifyingCf] = useState(false);
    const [isVerifyingLc, setIsVerifyingLc] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Reset verification states on input changes
    if (e.target.name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
    }

    if (e.target.name === "cf_id") {
      setCfVerified(false);
    }

    if (e.target.name === "lc_id") {
      setLcVerified(false);
    }
  };

  const sendOtp = async () => {
    if (!isInstituteEmail(form.email)) {
      return toast.error("Use your institute email (@iitbhilai.ac.in)");
    }

    setOtpSent(true);
    toast.success("OTP successfully sent to your email");

    try {
      const res = await Axios({
        ...SummaryApi.sendEmail,
        data: {
          email: form.email,
          name: form.name,
        },
      });

      if (res.data.success) {
        // toast.success(res.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.verifyOtp,
        data: {
          email: form.email,
          otp: form.otp,
        },
      });

      if (res.data.success) {
        setOtpVerified(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const verifyCfId = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.verifyCfId,
        data: {
          cf_id: form.cf_id,
        },
      });

      if (res.data.success) {
        setCfVerified(true);
        toast.success("Codeforces ID verified.");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const verifyLcId = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.verifyLcId,
        data: {
          lc_id: form.lc_id,
        },
      });

      if (res.data.success) {
        toast.success("LeetCode ID verified.");
        setLcVerified(true);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleRegister = async () => {
    if (!isInstituteEmail(form.email)) {
      return toast.error("Use your institute email (@iitbhilai.ac.in)");
    }

    if (!otpVerified || !cfVerified || !lcVerified) return;

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!form.name || !form.email || !form.password || !form.cf_id || !form.lc_id) {
      return toast.error("All fields are required");
    }

    try {
      const res = await Axios({
        ...SummaryApi.register,
        data: {
          name: form.name,
          email: form.email,
          password: form.password,
          cf_id: form.cf_id,
          lc_id: form.lc_id,
        },
      });

      if (res.data.success) {
        toast.success("Registration successful! You can login now.");
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  // Enter key handling across phases
  useEffect(() => {
    const listener = (e) => {
      if (e.key !== "Enter") return;
      if (!otpSent) return sendOtp();
      if (otpSent && !otpVerified && form.otp.length === 6) return verifyOtp();
      if (otpVerified && (!cfVerified || !lcVerified)) {
        if (!cfVerified && form.cf_id) return verifyCfId();
        if (!lcVerified && form.lc_id) return verifyLcId();
        return;
      }
      if (otpVerified && cfVerified && lcVerified) return handleRegister();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpSent, otpVerified, cfVerified, lcVerified, form]);

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-emerald-50 to-sky-100 dark:from-zinc-800 dark:to-zinc-900 px-4">
      <div className="mx-2 my-10 max-w-md lg:min-w-md p-6 md:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur shadow-xl rounded-2xl space-y-5 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 animate-[fadeIn_300ms_ease-out]">
        <h2 className="text-3xl font-bold text-center text-emerald-700 dark:text-emerald-400">Register to Ingenuity</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
        />

        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Institute Email (e.g. abc@iitbhilai.ac.in)"
            ref={emailRef}
            className="flex-1 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            disabled={otpVerified}
          />
          <button
            onClick={sendOtp}
            disabled={otpSent || otpVerified || !form.email}
            className={`cursor-pointer px-4 py-2 rounded-xl text-white font-medium shadow-sm transition-all ${
              otpSent ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {otpVerified ? "Verified" : "Send OTP"}
          </button>
        </div>

        {!otpVerified && (
          <div className="flex flex-col gap-3">
            <OTPInput
              length={6}
              value={form.otp}
              onChange={(v) => setForm((prev) => ({ ...prev, otp: v }))}
              onComplete={() => verifyOtp()}
            />
            <button
              onClick={verifyOtp}
              disabled={form.otp.length !== 6}
              className={`cursor-pointer px-4 py-2 rounded-xl text-white ${
                otpVerified ? "bg-emerald-600" : "bg-sky-600 hover:bg-sky-700"
              } transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {otpVerified ? "Verified" : "Verify"}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            name="cf_id"
            value={form.cf_id}
            onChange={handleChange}
            placeholder="Codeforces ID"
            className="flex-1 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
          <button
            onClick={verifyCfId}
            disabled={cfVerified || !form.cf_id}
            className={`cursor-pointer px-4 py-2 rounded-xl text-white font-medium shadow-sm transition-all ${
              cfVerified ? "bg-emerald-600" : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {cfVerified ? "Verified" : "Verify"}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            name="lc_id"
            value={form.lc_id}
            onChange={handleChange}
            placeholder="LeetCode ID"
            className="flex-1 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
          <button
            onClick={verifyLcId}
            disabled={lcVerified || !form.lc_id}
            className={`cursor-pointer px-4 py-2 rounded-xl text-white font-medium shadow-sm transition-all ${
              lcVerified ? "bg-emerald-600" : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {lcVerified ? "Verified" : "Verify"}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-zinc-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="relative">
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
          onClick={handleRegister}
          disabled={!(otpVerified && cfVerified && lcVerified)}
          className={`w-full py-3 rounded-xl font-semibold transition shadow ${
            otpVerified && cfVerified && lcVerified
              ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
              : "bg-zinc-400 text-white cursor-not-allowed"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}
