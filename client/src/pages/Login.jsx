import React, { useState } from "react";
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

  const isFormFilled = form.email.trim() && form.password.trim();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 dark:from-zinc-800 dark:to-zinc-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl space-y-6 text-zinc-900 dark:text-white transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-400">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Login to your Ingenuity account
        </p>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-zinc-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline transition-all duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              isFormFilled
                ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                : "bg-zinc-400 cursor-not-allowed"
            }`}
            disabled={!isFormFilled}
          >
            Login
          </button>
        </div>

        <div className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
