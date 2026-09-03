import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Lock,
  User as UserIcon,
  Globe,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const {
    loginWithEmail,
    loginWithPhone,
    loginWithGoogle,
    registerUser,
    currentUser,
  } = useApp();

  const [mode, setMode] = useState<'login_email' | 'login_phone' | 'register' | 'forgot_pass'>('login_email');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Register Fields
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('New NEO explorer & music lover 🎧');
  const [country, setCountry] = useState('United States');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [dob, setDob] = useState('2000-01-01');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await loginWithEmail(email, password);
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
    setOtp('789456'); // Simulated verification OTP
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithPhone(phone, otp);
    onClose();
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;

    await registerUser({
      username,
      displayName: displayName || username,
      email,
      bio,
      country,
      gender,
      dateOfBirth: dob,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">NEO Account Center</h3>
            <p className="text-[11px] text-slate-400">Secure Authentication & Verification</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-4 pb-2">
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setMode('login_email'); setOtpSent(false); }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'login_email' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => { setMode('login_phone'); setOtpSent(false); }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'login_phone' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Phone OTP
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'register' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-4">
        {/* Mode: Email Login */}
        {mode === 'login_email' && (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot_pass')}
                className="text-[11px] text-purple-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xs text-white shadow hover:brightness-110 active:scale-95 transition"
            >
              Sign In with Email
            </button>
          </form>
        )}

        {/* Mode: Phone OTP */}
        {mode === 'login_phone' && (
          <form onSubmit={otpSent ? handleVerifyPhone : handleSendOtp} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {otpSent && (
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SMS Code Sent! Code: 789456</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full bg-slate-900 border border-purple-500 rounded-xl px-3 py-2 text-center text-base tracking-widest font-black text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xs text-white shadow hover:brightness-110 active:scale-95 transition"
            >
              {otpSent ? 'Verify OTP & Log In' : 'Send Verification OTP'}
            </button>
          </form>
        )}

        {/* Mode: Register New Profile */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Username (@handle)</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. cyber_artist"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Luna Sky"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="luna@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xs text-white shadow hover:brightness-110 active:scale-95 transition"
            >
              Complete Registration (+100 Free Coins)
            </button>
          </form>
        )}

        {/* Mode: Forgot Password */}
        {mode === 'forgot_pass' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Enter your registered email. We will send a secure password reset link to your inbox.
            </p>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => {
                alert('Password reset link dispatched!');
                setMode('login_email');
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 font-bold text-xs text-white"
            >
              Dispatch Reset Link
            </button>
            <button
              type="button"
              onClick={() => setMode('login_email')}
              className="w-full text-xs text-slate-400 hover:text-white"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* 1-Click Google Sign-In */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Or continue with
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold text-xs text-slate-200 flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
