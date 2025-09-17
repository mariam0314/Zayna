"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, User, KeyRound, Mail, Phone, Home } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
}

interface RegistrationData {
  name: string;
  phone: string;
  email: string;
  roomNo: string;
  password: string;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Login state
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Registration state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<null | { type: "success" | "error"; text: string }>(null);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/guest/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/guest/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userData: RegistrationData = {
      name,
      phone,
      email,
      roomNo,
      password: regPassword,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        setRegistrationData(userData);
        await sendOtp(email);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async (emailAddress: string) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress, name }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setCooldown(60);
        setNotice({ type: "success", text: data.message || "OTP sent. Please check your email." });
        // start countdown
        const interval = setInterval(() => {
          setCooldown((c) => {
            if (c <= 1) {
              clearInterval(interval);
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      } else {
        setError(data.error || "Failed to send OTP");
        setNotice({ type: "error", text: data.error || "Failed to send OTP" });
      }
    } catch {
      setError("Failed to send OTP");
      setNotice({ type: "error", text: "Failed to send OTP" });
    }
  };

  // Verify OTP
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!registrationData) {
      setError("Registration data is missing.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registrationData.email,
          otp,
          userData: registrationData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // After successful verification, provide guest ID and prefill login
        const newGuestId = data?.data?.guestId;
        if (newGuestId) {
          setNotice({ type: "success", text: `Account created! Your Guest ID is ${newGuestId}. We prefilled your login below.` });
          // Switch to login form with prefilled credentials
          setIsSignUp(false);
          setOtpSent(false);
          setUserId(newGuestId);
          setPassword(regPassword);
          // Optionally auto-sign-in after short delay
          setTimeout(() => {
            // Call handleLogin directly (no unused local vars)
            handleLogin({ preventDefault: () => {}, stopPropagation: () => {} } as unknown as React.FormEvent);
          }, 1200);
        } else {
          setNotice({ type: "success", text: "Account verified! Please sign in using your Guest ID and password." });
          setIsSignUp(false);
          setOtpSent(false);
        }
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Ensure portal target is available (avoids SSR mismatch)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="card-black rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gold-gradient p-6 text-black relative">
          <button
            onClick={onClose}
            aria-label="Close login"
            title="Close"
            className="absolute top-4 right-4 p-2 rounded-full transition shadow-md bg-white/90 hover:bg-white text-black border border-black/10"
          >
            <X size={22} />
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {otpSent ? "Verify OTP" : isSignUp ? "Create Account" : "Guest Login"}
          </h2>
          <p className="text-black text-opacity-90">
            {otpSent
              ? `Enter the OTP sent to ${registrationData?.email}`
              : isSignUp
              ? "Fill in your details to register"
              : "Enter your credentials to access guest services"}
          </p>
        </div>

        <div className="p-6">
          {notice && (
            <div className={`mb-4 p-3 rounded-lg text-sm border ${notice.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
              <div className="flex justify-between items-start gap-3">
                <span>{notice.text}</span>
                <button onClick={() => setNotice(null)} className="text-foreground/60 hover:text-gold">×</button>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* OTP Verification Form */}
          {otpSent && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enter OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="6-digit OTP"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={cooldown > 0 || loading}
                    onClick={() => {
                      const targetEmail = registrationData?.email || email;
                      if (targetEmail) sendOtp(targetEmail);
                    }}
                    className={`btn-outline-gold w-full font-semibold py-2 rounded-xl ${cooldown > 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full font-semibold py-2 rounded-xl"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {!otpSent && isSignUp && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="05XXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Room Number</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="text"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="101"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 btn-gold w-full font-semibold py-2 rounded-xl"
              >
                {loading ? "Creating account..." : "Sign up & Send OTP"}
              </button>

              <p className="text-xs text-foreground/60 text-center">
                Already have an account?{" "}
                <button type="button" className="text-gold" onClick={() => setIsSignUp(false)}>Sign in</button>
              </p>
              <div className="flex justify-center">
                <button type="button" onClick={onClose} className="text-foreground/70 hover:text-gold text-sm mt-1">Close</button>
              </div>
            </form>
          )}

          {/* Login Form */}
          {!otpSent && !isSignUp && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Guest ID or Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="e.g. GUEST101_1234 or you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="Your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 btn-gold w-full font-semibold py-2 rounded-xl"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-xs text-foreground/60 text-center">
                New to Zayna?{" "}
                <button type="button" className="text-gold" onClick={() => setIsSignUp(true)}>Create an account</button>
              </p>
              <div className="flex justify-center">
                <button type="button" onClick={onClose} className="text-foreground/70 hover:text-gold text-sm mt-1">Close</button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}