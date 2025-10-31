"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  organization?: string;
}

interface LoginSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const CenteredLoginSignupModal: React.FC<LoginSignupModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "fundraiser",
    organization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-80 sm:mt-80">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:[#094C3B] focus:outline-none"
                />
                <input
                  type="text"
                  name="organization"
                  placeholder="Organization (optional)"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#094C3B] focus:outline-none"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#094C3B] focus:outline-none"
                >
                  <option value="fundraiser">Fundraiser</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:[#094C3B] focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:[#094C3B] focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#094C3B] text-white p-2 rounded hover:bg-[#094C3c] transition"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-[#094C3B] cursor-pointer font-medium"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CenteredLoginSignupModal;
