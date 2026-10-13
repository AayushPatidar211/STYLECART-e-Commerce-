import React, { useState } from 'react';
import { X, ShieldCheck, User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, quickLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        await register({ firstName, lastName, email, password, phoneNumber });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              {authModalTab === 'login' ? 'Sign in to StyleCart' : 'Create an Account'}
            </h2>
            <p className="text-xs text-neutral-500">
              Spring Security 6 + JWT Stateless Authentication
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick 1-Click Role Login Bar */}
        <div className="bg-neutral-50 p-4 border-b border-neutral-100 space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Instant Test Login (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('user')}
              className="py-2 px-3 text-xs bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md font-medium text-neutral-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <span>Customer Account</span>
            </button>
            <button
              type="button"
              onClick={() => quickLogin('admin')}
              className="py-2 px-3 text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md font-medium text-amber-900 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Account</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 text-xs font-medium">
          <button
            onClick={() => {
              setError(null);
              openAuthModal('login');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              authModalTab === 'login'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setError(null);
              openAuthModal('register');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              authModalTab === 'register'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
              {error}
            </div>
          )}

          {authModalTab === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Jenkins"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
