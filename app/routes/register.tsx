import type { Route } from "./+types/register";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Illustration from "../assets/illustration.png";
import Logo from "../assets/logo.png";

// Giả lập đọc & ghi user (vì frontend không ghi trực tiếp vào file public)
function getMockUsers() {
  const data = localStorage.getItem("mockUsers");
  if (data) return JSON.parse(data);
  return [
    { username: "abc", password: "1" },
    { username: "teacher", password: "teachpass" },
  ];
}

function saveMockUsers(users: any[]) {
  localStorage.setItem("mockUsers", JSON.stringify(users));
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SmartClassroom - Register" },
    { name: "description", content: "Register an account for SmartClassroom" },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[a-zA-Z]/.test(pwd) || !/[0-9]/.test(pwd))
      return "Password must contain letters and numbers";
    return "";
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!username.trim()) newErrors.username = "Username is required";

    const pwdError = validatePassword(password);
    if (!password.trim()) newErrors.password = "Password is required";
    else if (pwdError) newErrors.password = pwdError;

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const users = getMockUsers();
      // Check trùng username
      if (users.find((u: any) => u.username === username)) {
        alert("Username already exists!");
        return;
      }

      // const newUser = { username, password };
      // const updatedUsers = [...users, newUser];
      // saveMockUsers(updatedUsers);

      alert("Register successful!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Góc trái trên logo */}
      <div className="absolute top-4 left-6 flex items-center space-x-2 z-20">
        <img src={Logo} alt="SmartClassroom Logo" className="w-6 h-6" />
        <span className="text-gray-900 font-semibold text-lg">
          SmartClassroom
        </span>
      </div>

      {/* Trang trí góc trái */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-x-1/3 -translate-y-1/3 z-0"></div>
      {/* Trang trí góc phải */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3 z-0"></div>

      {/* Container chính */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 p-10 bg-white/90 rounded-2xl shadow-lg relative z-10">
        {/* Left section */}
        <form onSubmit={handleRegister} className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Create Account</h1>
          <p className="text-gray-600 mb-8">
            Join SmartClassroom today and start your journey
          </p>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border-b ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-indigo-500 py-2 text-gray-900 placeholder-gray-400`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border-b ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-indigo-500 py-2 pr-10 text-gray-900 placeholder-gray-400`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-0 top-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border-b ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-indigo-500 py-2 pr-10 text-gray-900 placeholder-gray-400`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                className="absolute right-0 top-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Register button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
          >
            Register
          </button>

          {/* Login link */}
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-500 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </form>

        {/* Right section */}
        <div className="hidden md:flex items-center justify-center">
          <img src={Illustration} alt="illustration" className="w-3/4" />
        </div>
      </div>
    </div>
  );
}
