import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import { User, Phone, Mail, Loader2, LogOut, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

interface ProfileProps {
  setPage: (page: Page) => void;
}

export default function Profile({ setPage }: ProfileProps) {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password change
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      setPage('login');
    }
  }, [user, authLoading, setPage]);

  // Load initial data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
      })
      .eq('id', user.id);

    if (updateError) {
      setError("Failed to update profile: " + updateError.message);
    } else {
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    
    setLoading(false);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setPwdError(null);
    setPwdSuccess(false);

    if (newPwd.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (newPwd === currentPwd) {
      setPwdError('New password must be different from the current one.');
      return;
    }

    setPwdLoading(true);

    // Verify current password by re-authenticating.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPwd,
    });
    if (signInError) {
      setPwdLoading(false);
      setPwdError('Current password is incorrect.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPwd });
    setPwdLoading(false);

    if (updateError) {
      setPwdError('Failed to update password: ' + updateError.message);
      return;
    }

    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setPwdSuccess(true);
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage('home');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-start justify-center relative max-w-7xl mx-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f2e] border border-[#2a3142] p-8 rounded-2xl shadow-xl h-fit"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#2a3142] rounded-full flex items-center justify-center mb-4 border border-[#3a4152] shadow-inner">
              <span className="text-3xl font-bold text-primary">
                {fullName ? fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{profile?.full_name || 'My Account'}</h2>
            <p className="text-slate-400 text-sm mb-6">{user.email}</p>
            
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-8">
              {profile?.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>

            <div className="w-full h-[1px] bg-[#2a3142] mb-6"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl border border-transparent hover:border-red-500/20 transition-all font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-[#1a1f2e] border border-[#2a3142] p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Profile Details</h2>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full bg-[#111520] border border-[#2a3142] text-slate-500 rounded-xl pl-11 pr-4 py-3 cursor-not-allowed opacity-70"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Email address cannot be changed currently.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading || (!fullName && !phone)}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>

          {/* ── Change Password ─────────────────────────────── */}
          <div className="mt-10 pt-8 border-t border-[#2a3142]">
            <h3 className="text-xl font-bold text-white mb-2">Change Password</h3>
            <p className="text-slate-500 text-sm mb-6">
              Enter your current password to confirm, then set a new one (min 6 characters).
            </p>

            <form onSubmit={handleChangePassword} className="space-y-5">
              {pwdError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Password updated successfully.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white"
                    aria-label={showPwd ? 'Hide passwords' : 'Show passwords'}
                  >
                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={pwdLoading || !currentPwd || newPwd.length < 6 || newPwd !== confirmPwd}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwdLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
