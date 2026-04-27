import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import {
  LogOut, LayoutDashboard, Loader2, Mail, Phone, Calendar,
  Search, X, MessageSquare, CheckCircle2, Clock, AlertCircle,
  Trash2, RefreshCw, Users
} from 'lucide-react';

interface AdminProps { setPage: (page: Page) => void; }

interface Lead {
  id: string; name: string; email: string | null;
  phone: string; service: string; message: string | null;
  status: string; created_at: string;
}

interface UserProfile {
  id: string; full_name: string | null;
  phone: string | null; role: string; created_at?: string;
}

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';
type Tab = 'leads' | 'users';

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  new:       { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  contacted: { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  closed:    { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/30' },
};

export default function Admin({ setPage }: AdminProps) {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setPage('login'); return; }
    if (profile !== null && profile.role !== 'admin') { setPage('home'); }
  }, [user, profile, authLoading, setPage]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error) setLeads(data || []);
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('role');
    if (!error) setUsers(data || []);
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    if (user && profile?.role === 'admin') fetchLeads();
  }, [user, profile, fetchLeads]);

  useEffect(() => {
    if (activeTab === 'users' && user && profile?.role === 'admin') fetchUsers();
  }, [activeTab, user, profile, fetchUsers]);

  const handleLogout = async () => { await supabase.auth.signOut(); setPage('login'); };

  const updateStatus = async (lead: Lead, newStatus: string) => {
    setUpdatingId(lead.id);
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === lead.id) setSelectedLead({ ...selectedLead, status: newStatus });
    }
    setUpdatingId(null);
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    setDeletingId(leadId);
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (!error) { setLeads(prev => prev.filter(l => l.id !== leadId)); if (selectedLead?.id === leadId) setSelectedLead(null); }
    setDeletingId(null);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  };

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) || (l.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && (statusFilter === 'all' || l.status === statusFilter);
  });

  if (authLoading || !user || profile === null || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-slate-400 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {profile.full_name || user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => activeTab === 'leads' ? fetchLeads() : fetchUsers()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1f2e] hover:bg-[#2a3142] text-slate-300 rounded-lg border border-[#2a3142] transition-all text-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a3142] hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded-lg border border-[#3a4152] hover:border-red-500/20 transition-all text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: stats.total, icon: <LayoutDashboard className="w-5 h-5" />, color: 'text-white', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'New', value: stats.new, icon: <AlertCircle className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Contacted', value: stats.contacted, icon: <Clock className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Closed', value: stats.closed, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.bg} ${s.border} ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-1.5 mb-6 w-fit">
        <button onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'leads' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}>
          <MessageSquare className="w-4 h-4" /> Leads <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'leads' ? 'bg-white/20' : 'bg-[#2a3142]'}`}>{stats.total}</span>
        </button>
        <button onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}>
          <Users className="w-4 h-4" /> Users <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'users' ? 'bg-white/20' : 'bg-[#2a3142]'}`}>{users.length}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── LEADS TAB ── */}
        {activeTab === 'leads' && (
          <motion.div key="leads" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {/* Filters */}
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-1 bg-[#111520] rounded-xl p-1">
                {(['all', 'new', 'contacted', 'closed'] as StatusFilter[]).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>
                    {s === 'all' ? `All (${stats.total})` : s === 'new' ? `New (${stats.new})` : s === 'contacted' ? `Contacted (${stats.contacted})` : `Closed (${stats.closed})`}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Search name, phone, email..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600" />
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111520] border-b border-[#2a3142]">
                    <tr>
                      {['Date', 'Customer', 'Service', 'Status', 'Actions'].map((h, i) => (
                        <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3142]">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">Loading leads...</p>
                      </td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center">
                        <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No leads found</p>
                        <p className="text-slate-600 text-sm mt-1">{searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Leads from the contact form will appear here'}</p>
                      </td></tr>
                    ) : filtered.map((lead, i) => {
                      const s = STATUS_STYLES[lead.status] || STATUS_STYLES.new;
                      return (
                        <motion.tr key={lead.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-[#202636] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Calendar className="w-4 h-4 text-slate-600" />
                              {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white mb-1">{lead.name}</div>
                            <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{lead.phone}</span>
                              {lead.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{lead.email}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-[#111520] border border-[#2a3142] rounded-full text-xs font-medium text-slate-300 capitalize">{lead.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {updatingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : (
                              <select value={lead.status} onChange={(e) => updateStatus(lead, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none bg-transparent ${s.bg} ${s.text} ${s.border}`}>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="closed">Closed</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedLead(lead)} className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-colors border border-primary/20">View Details</button>
                              <button onClick={() => deleteLead(lead.id)} disabled={deletingId === lead.id} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                {deletingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a3142] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Registered Users</h2>
                  <p className="text-slate-400 text-sm">{users.length} total accounts</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111520] border-b border-[#2a3142]">
                    <tr>
                      {['User', 'Phone', 'Role'].map(h => (
                        <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3142]">
                    {usersLoading ? (
                      <tr><td colSpan={3} className="px-6 py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">Loading users...</p>
                      </td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-16 text-center">
                        <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No users found</p>
                      </td></tr>
                    ) : users.map((u, i) => (
                      <motion.tr key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-[#202636] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#2a3142] flex items-center justify-center border border-[#3a4152] shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {(u.full_name || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-white">{u.full_name || <span className="text-slate-500 italic">No name</span>}</div>
                              <div className="text-xs text-slate-500">{u.id.substring(0, 16)}…</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {u.phone ? (
                            <a href={`tel:${u.phone}`} className="flex items-center gap-1.5 text-slate-300 hover:text-primary transition-colors text-sm">
                              <Phone className="w-3.5 h-3.5" />{u.phone}
                            </a>
                          ) : <span className="text-slate-600 text-sm">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            u.role === 'admin'
                              ? 'bg-primary/10 text-primary border-primary/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>{u.role}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLead(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a3142]">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-slate-400 text-sm mt-0.5">{new Date(selectedLead.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a3142] text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Phone</p>
                    <a href={`tel:${selectedLead.phone}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary shrink-0" />{selectedLead.phone}
                    </a>
                  </div>
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email</p>
                    {selectedLead.email ? (
                      <a href={`mailto:${selectedLead.email}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-primary shrink-0" /><span className="truncate">{selectedLead.email}</span>
                      </a>
                    ) : <span className="text-slate-500 text-sm">Not provided</span>}
                  </div>
                </div>
                <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Service Requested</p>
                  <p className="text-white font-semibold capitalize">{selectedLead.service}</p>
                </div>
                {selectedLead.message && (
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Message</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedLead.message}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex gap-2">
                    {['new', 'contacted', 'closed'].map(s => {
                      const style = STATUS_STYLES[s];
                      return (
                        <button key={s} onClick={() => updateStatus(selectedLead, s)} disabled={updatingId === selectedLead.id}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${selectedLead.status === s ? `${style.bg} ${style.text} ${style.border}` : 'bg-[#111520] text-slate-500 border-[#2a3142] hover:border-slate-500'}`}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#2a3142] flex justify-between items-center">
                <button onClick={() => deleteLead(selectedLead.id)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Lead
                </button>
                <button onClick={() => setSelectedLead(null)} className="px-5 py-2 bg-[#2a3142] hover:bg-[#3a4152] text-white rounded-xl text-sm font-medium transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
