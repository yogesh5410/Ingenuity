import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/userContext";

export default function Login() {

  const { user, setUser } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const navigate = useNavigate();


  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error("Email and password are required");
    }

    try {
      const res = await Axios({
        ...SummaryApi.login,
        data: {
          email: form.email,
          password: form.password,
        },
      });

      if (res.data.success) {
        toast.success("Login successful!");
        navigate('/');
        setUser(res.data.data)
        // Handle redirection or token storage here
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if (e.key !== "Enter") return;
      if (document.activeElement?.tagName?.toLowerCase() === 'button') return;
      handleLogin();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const isFormFilled = form.email.trim() && form.password.trim();

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl space-y-6 text-slate-800 dark:text-white transition-all duration-300 border border-slate-200 dark:border-slate-700 animate-[fadeIn_300ms_ease-out]">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Login to your Ingenuity account
        </p>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            ref={emailRef}
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              ref={passwordRef}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400 transition-all duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md ${
              isFormFilled
                ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                : "bg-slate-400 dark:bg-slate-500 cursor-not-allowed"
            }`}
            disabled={!isFormFilled}
          >
            Login
          </button>
        </div>

        <div className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
