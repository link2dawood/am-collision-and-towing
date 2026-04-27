import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  setPage: (page: Page) => void;
}

type LoginView = 'signin' | 'forgot' | 'reset_sent';

export default function Login({ setPage }: LoginProps) {
  const [view, setView] = useState<LoginView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      let { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || null,
            phone: data.user.user_metadata?.phone || null,
            role: 'user',
          })
          .select('role')
          .single();
        profile = newProfile;
      }

      if (profile?.role === 'admin') {
        setPage('admin');
      } else {
        setPage('profile');
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setView('reset_sent');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setPage('home')}
        className="absolute top-32 left-8 md:left-16 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </motion.button>

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1a1f2e] border border-[#2a3142] p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>

        {/* ── Reset sent confirmation ── */}
        {view === 'reset_sent' && (
          <div className="text-center relative z-10">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
            <p className="text-slate-400 mb-2">We sent a password reset link to</p>
            <p className="text-primary font-semibold mb-6">{email}</p>
            <p className="text-slate-500 text-sm mb-8">
              Click the link in that email to reset your password.
            </p>
            <button
              onClick={() => { setView('signin'); setError(null); }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* ── Forgot password form ── */}
        {view === 'forgot' && (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#2a3142] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#3a4152]">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-slate-400">Enter your email and we'll send a reset link.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setView('signin'); setError(null); }}
                  className="text-sm text-slate-400 hover:text-primary transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Sign in form ── */}
        {view === 'signin' && (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#2a3142] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#3a4152]">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Sign in to your AM Collision account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(null); }}
                    className="text-xs text-slate-400 hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setPage('signup')}
                    className="text-primary hover:text-primary-dark font-semibold transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
