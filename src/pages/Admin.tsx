import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import { LogOut, LayoutDashboard, Loader2, Mail, Phone, Calendar, Search } from 'lucide-react';

interface AdminProps {
  setPage: (page: Page) => void;
}

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
}

export default function Admin({ setPage }: AdminProps) {
  const { user, profile, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setPage('login');
      } else if (!profile || profile.role !== 'admin') {
        alert('Unauthorized. You need admin privileges to view this page.');
        setPage('home');
      }
    }
  }, [user, profile, authLoading, setPage]);

  const fetchLeads = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchLeads();
    }
  }, [user, profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage('login');
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage your leads and requests</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a3142] hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded-lg border border-[#3a4152] hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center shadow-xl">
        <div className="bg-[#111520] px-6 py-3 rounded-xl border border-[#2a3142]">
          <p className="text-sm text-slate-400 mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-white">{leads.length}</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#111520] border-b border-[#2a3142]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Service</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3142]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-slate-400">Loading leads...</p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={lead.id}
                    className="hover:bg-[#202636] transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white mb-1">{lead.name}</div>
                      <div className="flex flex-col gap-1 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-[#111520] border border-[#2a3142] rounded-full text-xs font-medium text-slate-300">
                        {lead.service}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        lead.status === 'new'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : lead.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-colors border border-primary/20">
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}