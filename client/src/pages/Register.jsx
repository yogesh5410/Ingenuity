import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import { useNavigate } from "react-router-dom";

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

  const isInstituteEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/.test(email);
  };

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

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-100 dark:bg-zinc-700 px-4">
      <div className="mx-2 my-10 max-w-md lg:min-w-md p-6 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl space-y-4 text-zinc-900 dark:text-white">
        <h2 className="text-2xl font-semibold text-center">Register to Ingenuity</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
        />

        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Institute Email (e.g. abc@iitbhilai.ac.in)"
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

        {!otpVerified && (
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
              className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
                otpVerified ? "bg-green-600" : "bg-blue-400"
              } disabled:opacity-50`}
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
            className="flex-1 p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          />
          <button
            onClick={verifyCfId}
            disabled={cfVerified || !form.cf_id}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
              cfVerified ? "bg-green-600" : "bg-blue-600"
            } disabled:opacity-50`}
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
            className="flex-1 p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          />
          <button
            onClick={verifyLcId}
            disabled={lcVerified || !form.lc_id}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
              lcVerified ? "bg-green-600" : "bg-blue-600"
            } disabled:opacity-50`}
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
            className="w-full p-2 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
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
          onClick={handleRegister}
          disabled={!(otpVerified && cfVerified && lcVerified)}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            otpVerified && cfVerified && lcVerified
              ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}
