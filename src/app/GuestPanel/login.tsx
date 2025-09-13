"use client";
import { useState, useEffect } from "react";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);

  // login state
  const [guestId, setGuestId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ show/hide password

  // register state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // In-memory storage for credentials
  const [savedCredentials, setSavedCredentials] = useState<{
    guestId: string;
    password: string;
  } | null>(null);

  // Load saved credentials when modal opens
  useEffect(() => {
    if (savedCredentials) {
      setGuestId(savedCredentials.guestId);
      setPassword(savedCredentials.password);
    }
  }, [savedCredentials]);

  // generate guest ID
  const generateGuestId = () => {
    const prefix = "GUEST";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // generate random password
  const generatePassword = (length = 8) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // Save credentials to in-memory storage
  const saveCredentials = (id: string, pass: string) => {
    setSavedCredentials({ guestId: id, password: pass });
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/guest/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response.");
      }

      const data = await res.json();

      if (data.success) {
        alert("✅ Login successful!");
        saveCredentials(guestId, password);
        onClose();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error("Login API error:", err);
      if (err instanceof Error) {
        alert(`❌ Login failed: ${err.message}`);
      } else {
        alert("❌ Login failed due to server error.");
      }
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newGuestId = generateGuestId();
    const newPassword = generatePassword();

    try {
      const res = await fetch("/api/guest/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          guestId: newGuestId,
          password: newPassword,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response.");
      }

      const data = await res.json();

      if (data.success) {
        alert(
          `🎉 Registration Successful!\n\nYour Guest ID: ${newGuestId}\nPassword: ${newPassword}`
        );
        saveCredentials(newGuestId, newPassword);
        setName("");
        setEmail("");
        setPhone("");
        setIsRegister(false);
        setGuestId(newGuestId);
        setPassword(newPassword);
      } else {
        alert(`❌ Registration Failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Register API error:", err);
      if (err instanceof Error) {
        alert(`❌ Registration failed: ${err.message}`);
      } else {
        alert("❌ Registration failed due to server error.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {isRegister ? "Guest Registration" : "Guest Login"}
        </h2>

        {/* Login Form */}
        {!isRegister ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Guest ID"
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700"
            >
              Login
            </button>
          </form>
        ) : (
          // Registration Form
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Register
            </button>
          </form>
        )}

        {/* Toggle Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>

        {/* Show saved credentials info */}
        {savedCredentials && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
            <p className="text-gray-700">Saved credentials available for this session</p>
            <p className="text-xs text-gray-500">Guest ID: {savedCredentials.guestId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
