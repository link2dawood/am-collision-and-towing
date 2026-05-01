import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import {
  LogOut, LayoutDashboard, Loader2, Mail, Phone, Calendar,
  Search, X, MessageSquare, Trash2, RefreshCw, Users, Car,
  TrendingUp, Settings, ImageIcon, Upload, Save, ExternalLink,
  ToggleLeft, ToggleRight, Tag, Edit2, Check, Plus,
} from 'lucide-react';

interface AdminProps { setPage: (page: Page) => void; }

interface Lead {
  id: string; name: string; email: string | null;
  phone: string; service_type: string; message: string | null;
  status: string; created_at: string;
}
interface Contact {
  id: string; name: string; email: string;
  phone: string | null; subject: string | null; message: string;
  status: string; created_at: string;
}
interface Quote {
  id: string; name: string; email: string; phone: string;
  vehicle_year: string | null; vehicle_make: string | null;
  vehicle_model: string | null; vehicle_color: string | null;
  damage_description: string | null; service_needed: string | null;
  estimated_budget: string | null; status: string;
  quote_amount: number | null; created_at: string;
}
interface UserProfile {
  id: string; full_name: string | null; phone: string | null; role: string;
}
interface GalleryImage {
  id: string; name: string; url: string; storage_path: string;
  alt_text: string | null; tags: string[]; sort_order: number; created_at: string;
}
interface SiteSettings {
  general:       { site_name: string; tagline: string; phone: string; fax: string; email: string; address: string; };
  branding:      { logo_url: string | null; favicon_url: string | null; primary_color: string; hero_tagline: string | null; };
  social:        { facebook: string | null; instagram: string | null; google_maps: string | null; yelp: string | null; };
  notifications: { admin_email: string; send_user_emails: boolean; send_admin_emails: boolean; };
}

type Tab = 'overview' | 'leads' | 'contacts' | 'quotes' | 'users' | 'gallery' | 'settings';

const LEAD_STATUS: Record<string, { bg: string; text: string; border: string }> = {
  new:       { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  contacted: { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  closed:    { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/30' },
};
const CONTACT_STATUS: Record<string, { bg: string; text: string; border: string }> = {
  new:     { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  read:    { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  replied: { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/30' },
};
const QUOTE_STATUS: Record<string, { bg: string; text: string; border: string }> = {
  new:       { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  quoted:    { bg: 'bg-yellow-500/10',  text: 'text-yellow-400',  border: 'border-yellow-500/30' },
  approved:  { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  completed: { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/30' },
  declined:  { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/30' },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const DEFAULTS: SiteSettings = {
  general:       { site_name: 'AM Collision & Towing', tagline: 'Your Trusted Auto Body & Towing Experts', phone: '+1 631-676-4440', fax: '+1 631-676-4443', email: 'amcollisionandtowing@gmail.com', address: '500 Johnson Ave, Bohemia, New York 11716' },
  branding:      { logo_url: null, favicon_url: null, primary_color: '#dc2626', hero_tagline: null },
  social:        { facebook: null, instagram: null, google_maps: null, yelp: null },
  notifications: { admin_email: 'amcollisionandtowing@gmail.com', send_user_emails: true, send_admin_emails: true },
};

// ── field helpers ─────────────────────────────────────────────
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
const inp = 'w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600';

export default function Admin({ setPage }: AdminProps) {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab]   = useState<Tab>('overview');

  // ── data states ───────────────────────────────────────────
  const [leads,    setLeads]    = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [quotes,   setQuotes]   = useState<Quote[]>([]);
  const [users,    setUsers]    = useState<UserProfile[]>([]);
  const [gallery,  setGallery]  = useState<GalleryImage[]>([]);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(DEFAULTS);

  // ── loading states ────────────────────────────────────────
  const [leadsLoading,    setLeadsLoading]    = useState(true);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [quotesLoading,   setQuotesLoading]   = useState(true);
  const [usersLoading,    setUsersLoading]    = useState(false);
  const [galleryLoading,  setGalleryLoading]  = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving,  setSettingsSaving]  = useState(false);
  const [uploading,       setUploading]       = useState(false);
  const [deletingId,      setDeletingId]      = useState<string | null>(null);
  const [editingImg,      setEditingImg]      = useState<GalleryImage | null>(null);
  const [editDraft,       setEditDraft]       = useState<{ name: string; alt_text: string; tags: string[]; sort_order: number } | null>(null);
  const [editSaving,      setEditSaving]      = useState(false);
  const [customTagInput,  setCustomTagInput]  = useState('');

  // ── search / selection ────────────────────────────────────
  const [leadSearch,    setLeadSearch]    = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [quoteSearch,   setQuoteSearch]   = useState('');
  const [selectedLead,    setSelectedLead]    = useState<Lead | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedQuote,   setSelectedQuote]   = useState<Quote | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── auth guard ────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setPage('login'); return; }
    if (profile !== null && profile.role !== 'admin') setPage('home');
  }, [user, profile, authLoading, setPage]);

  // ── fetchers ──────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
    setLeadsLoading(false);
  }, []);

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setContacts(data || []);
    setContactsLoading(false);
  }, []);

  const fetchQuotes = useCallback(async () => {
    setQuotesLoading(true);
    const { data } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
    setQuotes(data || []);
    setQuotesLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('role');
    setUsers(data || []);
    setUsersLoading(false);
  }, []);

  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    const { data } = await supabase
      .from('media_gallery').select('*')
      .order('sort_order').order('created_at', { ascending: false });
    setGallery(data || []);
    setGalleryLoading(false);
  }, []);

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    const { data } = await supabase.from('site_settings').select('key, value');
    if (data) {
      const map: Record<string, unknown> = {};
      data.forEach(row => { map[row.key] = row.value; });
      const merged = { ...DEFAULTS, ...map } as SiteSettings;
      setSettingsDraft(merged);
    }
    setSettingsLoading(false);
  }, []);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchLeads();
      fetchContacts();
      fetchQuotes();
    }
  }, [user, profile, fetchLeads, fetchContacts, fetchQuotes]);

  useEffect(() => {
    if (!user || profile?.role !== 'admin') return;
    if (activeTab === 'users')    fetchUsers();
    if (activeTab === 'gallery')  fetchGallery();
    if (activeTab === 'settings') fetchSettings();
  }, [activeTab, user, profile, fetchUsers, fetchGallery, fetchSettings]);

  // ── status updaters ───────────────────────────────────────
  const updateLeadStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!error) {
      setLeads(p => p.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) setSelectedLead(s => s ? { ...s, status } : s);
    }
    setUpdatingId(null);
  };

  const updateContactStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id);
    if (!error) {
      setContacts(p => p.map(c => c.id === id ? { ...c, status } : c));
      if (selectedContact?.id === id) setSelectedContact(s => s ? { ...s, status } : s);
    }
    setUpdatingId(null);
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('quote_requests').update({ status }).eq('id', id);
    if (!error) {
      setQuotes(p => p.map(q => q.id === id ? { ...q, status } : q));
      if (selectedQuote?.id === id) setSelectedQuote(s => s ? { ...s, status } : s);
    }
    setUpdatingId(null);
  };

  // ── deleters ──────────────────────────────────────────────
  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) { setLeads(p => p.filter(l => l.id !== id)); if (selectedLead?.id === id) setSelectedLead(null); }
    setDeletingId(null);
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (!error) { setContacts(p => p.filter(c => c.id !== id)); if (selectedContact?.id === id) setSelectedContact(null); }
    setDeletingId(null);
  };

  const deleteQuote = async (id: string) => {
    if (!confirm('Delete this quote request?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('quote_requests').delete().eq('id', id);
    if (!error) { setQuotes(p => p.filter(q => q.id !== id)); if (selectedQuote?.id === id) setSelectedQuote(null); }
    setDeletingId(null);
  };

  // ── gallery actions ───────────────────────────────────────
  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage.from('media').upload(path, file, { cacheControl: '31536000' });
    if (upErr) {
      console.error('Storage upload error:', upErr);
      alert(`Upload failed: ${upErr.message}\n\nMake sure the "media" storage bucket exists in Supabase and that RLS policies allow admin uploads. Run supabase_gallery_fix.sql in the Supabase SQL Editor.`);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    const { error: dbErr } = await supabase.from('media_gallery').insert({
      name: file.name.replace(/\.[^.]+$/, ''),
      url: publicUrl,
      storage_path: path,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: user?.id,
    });
    if (dbErr) {
      console.error('DB insert error:', dbErr);
      alert(`Image uploaded to storage but failed to save metadata: ${dbErr.message}\n\nRun supabase_gallery_fix.sql to create the media_gallery table.`);
    }

    await fetchGallery();
    setUploading(false);
  };

  const deleteGalleryImage = async (img: GalleryImage) => {
    if (!confirm(`Delete "${img.name}"?`)) return;
    setDeletingId(img.id);
    await supabase.storage.from('media').remove([img.storage_path]);
    await supabase.from('media_gallery').delete().eq('id', img.id);
    setGallery(p => p.filter(g => g.id !== img.id));
    if (editingImg?.id === img.id) { setEditingImg(null); setEditDraft(null); }
    setDeletingId(null);
  };

  const openEditPanel = (img: GalleryImage) => {
    setEditingImg(img);
    setEditDraft({ name: img.name, alt_text: img.alt_text ?? '', tags: img.tags ?? [], sort_order: img.sort_order ?? 0 });
    setCustomTagInput('');
  };

  const toggleTag = (tag: string) => {
    if (!editDraft) return;
    setEditDraft(d => d ? ({
      ...d,
      tags: d.tags.includes(tag) ? d.tags.filter(t => t !== tag) : [...d.tags, tag],
    }) : d);
  };

  const addCustomTag = () => {
    const t = customTagInput.trim().toLowerCase();
    if (!t || !editDraft || editDraft.tags.includes(t)) { setCustomTagInput(''); return; }
    setEditDraft(d => d ? { ...d, tags: [...d.tags, t] } : d);
    setCustomTagInput('');
  };

  const saveImageEdit = async () => {
    if (!editingImg || !editDraft) return;
    setEditSaving(true);
    const { error } = await supabase.from('media_gallery').update({
      name:       editDraft.name,
      alt_text:   editDraft.alt_text || null,
      tags:       editDraft.tags,
      sort_order: editDraft.sort_order,
    }).eq('id', editingImg.id);
    if (!error) {
      setGallery(p => p.map(g => g.id === editingImg.id
        ? { ...g, ...editDraft, alt_text: editDraft.alt_text || null }
        : g
      ));
      setEditingImg(prev => prev ? { ...prev, ...editDraft, alt_text: editDraft.alt_text || null } : prev);
    } else {
      alert('Save failed: ' + error.message);
    }
    setEditSaving(false);
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.currentTarget.files ?? []) as File[]);
    for (const f of files) await uploadImage(f);
    e.currentTarget.value = '';
  };

  // ── settings save ─────────────────────────────────────────
  const saveSettings = async () => {
    setSettingsSaving(true);
    const rows = Object.entries(settingsDraft).map(([key, value]) => ({ key, value, updated_by: user?.id }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) console.error('Settings save error:', error);
    setSettingsSaving(false);
  };

  function patchDraft<K extends keyof SiteSettings>(section: K, field: keyof SiteSettings[K], val: unknown) {
    setSettingsDraft(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: val },
    }));
  }

  const handleLogout = async () => { await supabase.auth.signOut(); setPage('login'); };

  // ── filtered lists ────────────────────────────────────────
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.phone.includes(leadSearch) ||
    (l.email || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.service_type.toLowerCase().includes(leadSearch.toLowerCase())
  );
  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
    (c.subject || '').toLowerCase().includes(contactSearch.toLowerCase())
  );
  const filteredQuotes = quotes.filter(q =>
    q.name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
    q.email.toLowerCase().includes(quoteSearch.toLowerCase()) ||
    (q.vehicle_make || '').toLowerCase().includes(quoteSearch.toLowerCase()) ||
    (q.vehicle_model || '').toLowerCase().includes(quoteSearch.toLowerCase())
  );

  // ── stats ─────────────────────────────────────────────────
  const stats = {
    totalLeads:    leads.length,     newLeads:    leads.filter(l => l.status === 'new').length,
    totalContacts: contacts.length,  newContacts: contacts.filter(c => c.status === 'new').length,
    totalQuotes:   quotes.length,    newQuotes:   quotes.filter(q => q.status === 'new').length,
  };

  if (authLoading || !user || profile === null || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-slate-400 font-medium">Loading dashboard…</span>
      </div>
    );
  }

  // ── tab config ────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: ReactNode; count?: number }[] = [
    { id: 'overview',  label: 'Overview',  icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'leads',     label: 'Leads',     icon: <MessageSquare className="w-4 h-4" />, count: stats.totalLeads },
    { id: 'contacts',  label: 'Contacts',  icon: <Mail className="w-4 h-4" />,          count: stats.totalContacts },
    { id: 'quotes',    label: 'Quotes',    icon: <Car className="w-4 h-4" />,            count: stats.totalQuotes },
    { id: 'users',     label: 'Users',     icon: <Users className="w-4 h-4" />,          count: users.length },
    { id: 'gallery',   label: 'Gallery',   icon: <ImageIcon className="w-4 h-4" />,      count: gallery.length },
    { id: 'settings',  label: 'Settings',  icon: <Settings className="w-4 h-4" /> },
  ];

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
          <button
            onClick={() => { fetchLeads(); fetchContacts(); fetchQuotes(); if (activeTab === 'users') fetchUsers(); if (activeTab === 'gallery') fetchGallery(); if (activeTab === 'settings') fetchSettings(); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1f2e] hover:bg-[#2a3142] text-slate-300 rounded-lg border border-[#2a3142] transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a3142] hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded-lg border border-[#3a4152] hover:border-red-500/20 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads',    value: stats.totalLeads,    badge: stats.newLeads,    icon: <MessageSquare className="w-5 h-5" />, color: 'text-primary',    bg: 'bg-primary/10',    border: 'border-primary/20' },
          { label: 'Total Contacts', value: stats.totalContacts, badge: stats.newContacts, icon: <Mail className="w-5 h-5" />,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
          { label: 'Quote Requests', value: stats.totalQuotes,   badge: stats.newQuotes,   icon: <Car className="w-5 h-5" />,            color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Gallery Images', value: gallery.length,      badge: 0,                 icon: <ImageIcon className="w-5 h-5" />,      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${s.bg} ${s.border} ${s.color}`}>{s.icon}</div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium truncate">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                {s.badge > 0 && <span className="text-xs font-bold text-emerald-400">{s.badge} new</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-1.5 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'
            }`}>
            {t.icon} {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === t.id ? 'bg-white/20' : 'bg-[#2a3142]'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#2a3142] flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Recent Leads</h3>
                <button onClick={() => setActiveTab('leads')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="divide-y divide-[#2a3142]">
                {leadsLoading ? <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" /></div>
                  : leads.slice(0, 5).map(l => (
                    <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{l.name}</p>
                        <p className="text-xs text-slate-500 truncate">{l.service_type}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${(LEAD_STATUS[l.status] || LEAD_STATUS.new).bg} ${(LEAD_STATUS[l.status] || LEAD_STATUS.new).text} ${(LEAD_STATUS[l.status] || LEAD_STATUS.new).border}`}>{l.status}</span>
                    </div>
                  ))}
                {!leadsLoading && leads.length === 0 && <p className="p-5 text-slate-500 text-sm text-center">No leads yet</p>}
              </div>
            </div>
            {/* Recent Contacts */}
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#2a3142] flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> Recent Contacts</h3>
                <button onClick={() => setActiveTab('contacts')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="divide-y divide-[#2a3142]">
                {contactsLoading ? <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" /></div>
                  : contacts.slice(0, 5).map(c => (
                    <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 truncate">{c.subject || c.message.slice(0, 30)}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${(CONTACT_STATUS[c.status] || CONTACT_STATUS.new).bg} ${(CONTACT_STATUS[c.status] || CONTACT_STATUS.new).text} ${(CONTACT_STATUS[c.status] || CONTACT_STATUS.new).border}`}>{c.status}</span>
                    </div>
                  ))}
                {!contactsLoading && contacts.length === 0 && <p className="p-5 text-slate-500 text-sm text-center">No messages yet</p>}
              </div>
            </div>
            {/* Recent Quotes */}
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#2a3142] flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2"><Car className="w-4 h-4 text-yellow-400" /> Recent Quotes</h3>
                <button onClick={() => setActiveTab('quotes')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="divide-y divide-[#2a3142]">
                {quotesLoading ? <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" /></div>
                  : quotes.slice(0, 5).map(q => (
                    <div key={q.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{q.name}</p>
                        <p className="text-xs text-slate-500 truncate">{[q.vehicle_year, q.vehicle_make, q.vehicle_model].filter(Boolean).join(' ') || '—'}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${(QUOTE_STATUS[q.status] || QUOTE_STATUS.new).bg} ${(QUOTE_STATUS[q.status] || QUOTE_STATUS.new).text} ${(QUOTE_STATUS[q.status] || QUOTE_STATUS.new).border}`}>{q.status}</span>
                    </div>
                  ))}
                {!quotesLoading && quotes.length === 0 && <p className="p-5 text-slate-500 text-sm text-center">No quotes yet</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LEADS ── */}
        {activeTab === 'leads' && (
          <motion.div key="leads" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <p className="text-slate-300 font-semibold">{filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}</p>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Search leads…" value={leadSearch} onChange={e => setLeadSearch(e.target.value)}
                  className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600" />
              </div>
            </div>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111520] border-b border-[#2a3142]">
                    <tr>{['Date', 'Customer', 'Service', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3142]">
                    {leadsLoading ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" /><p className="text-slate-400 text-sm">Loading…</p></td></tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center"><MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">No leads found</p></td></tr>
                    ) : filteredLeads.map((lead, i) => {
                      const s = LEAD_STATUS[lead.status] || LEAD_STATUS.new;
                      return (
                        <motion.tr key={lead.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#202636] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-600" />{fmt(lead.created_at)}</div></td>
                          <td className="px-6 py-4"><div className="font-semibold text-white mb-1">{lead.name}</div><div className="flex flex-col gap-0.5 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{lead.phone}</span>{lead.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{lead.email}</span>}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 bg-[#111520] border border-[#2a3142] rounded-full text-xs font-medium text-slate-300 capitalize">{lead.service_type}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {updatingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : (
                              <select value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none bg-transparent ${s.bg} ${s.text} ${s.border}`}>
                                <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedLead(lead)} className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-colors border border-primary/20">View</button>
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

        {/* ── CONTACTS ── */}
        {activeTab === 'contacts' && (
          <motion.div key="contacts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <p className="text-slate-300 font-semibold">{filteredContacts.length} message{filteredContacts.length !== 1 ? 's' : ''}</p>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Search messages…" value={contactSearch} onChange={e => setContactSearch(e.target.value)}
                  className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600" />
              </div>
            </div>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111520] border-b border-[#2a3142]">
                    <tr>{['Date', 'Sender', 'Subject', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3142]">
                    {contactsLoading ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" /><p className="text-slate-400 text-sm">Loading…</p></td></tr>
                    ) : filteredContacts.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center"><Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">No messages yet</p></td></tr>
                    ) : filteredContacts.map((c, i) => {
                      const s = CONTACT_STATUS[c.status] || CONTACT_STATUS.new;
                      return (
                        <motion.tr key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#202636] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-600" />{fmt(c.created_at)}</div></td>
                          <td className="px-6 py-4"><div className="font-semibold text-white mb-1">{c.name}</div><div className="flex flex-col gap-0.5 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{c.email}</span>{c.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{c.phone}</span>}</div></td>
                          <td className="px-6 py-4 max-w-[200px]"><p className="text-slate-300 text-sm font-medium truncate">{c.subject || '—'}</p><p className="text-slate-500 text-xs truncate">{c.message}</p></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {updatingId === c.id ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : (
                              <select value={c.status} onChange={e => updateContactStatus(c.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none bg-transparent ${s.bg} ${s.text} ${s.border}`}>
                                <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedContact(c)} className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-colors border border-primary/20">View</button>
                              <button onClick={() => deleteContact(c.id)} disabled={deletingId === c.id} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                {deletingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

        {/* ── QUOTES ── */}
        {activeTab === 'quotes' && (
          <motion.div key="quotes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <p className="text-slate-300 font-semibold">{filteredQuotes.length} quote request{filteredQuotes.length !== 1 ? 's' : ''}</p>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Search quotes…" value={quoteSearch} onChange={e => setQuoteSearch(e.target.value)}
                  className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600" />
              </div>
            </div>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111520] border-b border-[#2a3142]">
                    <tr>{['Date', 'Customer', 'Vehicle', 'Service', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3142]">
                    {quotesLoading ? (
                      <tr><td colSpan={6} className="px-6 py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" /><p className="text-slate-400 text-sm">Loading…</p></td></tr>
                    ) : filteredQuotes.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-16 text-center"><Car className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">No quote requests yet</p></td></tr>
                    ) : filteredQuotes.map((q, i) => {
                      const s = QUOTE_STATUS[q.status] || QUOTE_STATUS.new;
                      const vehicle = [q.vehicle_year, q.vehicle_make, q.vehicle_model].filter(Boolean).join(' ') || '—';
                      return (
                        <motion.tr key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#202636] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-600" />{fmt(q.created_at)}</div></td>
                          <td className="px-6 py-4"><div className="font-semibold text-white mb-1">{q.name}</div><div className="flex flex-col gap-0.5 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{q.phone}</span><span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{q.email}</span></div></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{vehicle}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 bg-[#111520] border border-[#2a3142] rounded-full text-xs font-medium text-slate-300 capitalize">{q.service_needed || '—'}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {updatingId === q.id ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : (
                              <select value={q.status} onChange={e => updateQuoteStatus(q.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none bg-transparent ${s.bg} ${s.text} ${s.border}`}>
                                <option value="new">New</option><option value="quoted">Quoted</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="declined">Declined</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedQuote(q)} className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-colors border border-primary/20">View</button>
                              <button onClick={() => deleteQuote(q.id)} disabled={deletingId === q.id} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                {deletingId === q.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a3142]">
                <h2 className="text-lg font-bold text-white">Registered Users</h2>
                <p className="text-slate-400 text-sm">{users.length} total accounts</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111520] border-b border-[#2a3142]">
                    <tr>{['User', 'Phone', 'Role'].map(h => (
                      <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3142]">
                    {usersLoading ? (
                      <tr><td colSpan={3} className="px-6 py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" /><p className="text-slate-400 text-sm">Loading…</p></td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-16 text-center"><Users className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">No users yet</p></td></tr>
                    ) : users.map((u, i) => (
                      <motion.tr key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#202636] transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#2a3142] flex items-center justify-center border border-[#3a4152] shrink-0"><span className="text-sm font-bold text-primary">{(u.full_name || '?').charAt(0).toUpperCase()}</span></div><div><div className="font-semibold text-white">{u.full_name || <span className="text-slate-500 italic">No name</span>}</div><div className="text-xs text-slate-500">{u.id.substring(0, 16)}…</div></div></div></td>
                        <td className="px-6 py-4">{u.phone ? <a href={`tel:${u.phone}`} className="flex items-center gap-1.5 text-slate-300 hover:text-primary transition-colors text-sm"><Phone className="w-3.5 h-3.5" />{u.phone}</a> : <span className="text-slate-600 text-sm">—</span>}</td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{u.role}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── GALLERY ── */}
        {activeTab === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />

            {/* Toolbar */}
            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="text-white font-semibold">{gallery.length} image{gallery.length !== 1 ? 's' : ''}</p>
                <p className="text-slate-500 text-xs mt-0.5">Click any image to edit its tags, title &amp; sort order</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload Images</>}
              </button>
            </div>

            {/* Main area: grid + side panel */}
            <div className="flex gap-5 items-start">

              {/* Grid */}
              <div className="flex-1 min-w-0">
                {galleryLoading ? (
                  <div className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" /><p className="text-slate-400">Loading gallery…</p></div>
                ) : gallery.length === 0 ? (
                  <div className="bg-[#1a1f2e] border-2 border-dashed border-[#2a3142] rounded-2xl py-24 text-center">
                    <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium mb-2">No images yet</p>
                    <p className="text-slate-600 text-sm mb-6">Upload images to build your gallery</p>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl mx-auto transition-all hover:bg-primary-dark">
                      <Upload className="w-4 h-4" /> Upload your first image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gallery.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => openEditPanel(img)}
                        className={`group relative bg-[#1a1f2e] rounded-xl overflow-hidden border-2 aspect-square cursor-pointer transition-all ${
                          editingImg?.id === img.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-[#2a3142] hover:border-primary/50'
                        }`}
                      >
                        <img src={img.url} alt={img.alt_text || img.name} className="w-full h-full object-cover" loading="lazy" />

                        {/* Tags badge */}
                        {img.tags && img.tags.length > 0 && (
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {img.tags.slice(0, 2).map(t => (
                              <span key={t} className="px-1.5 py-0.5 bg-primary/90 text-white text-[9px] font-bold uppercase rounded">{t}</span>
                            ))}
                            {img.tags.length > 2 && <span className="px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded">+{img.tags.length - 2}</span>}
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          <Edit2 className="w-5 h-5 text-white" />
                          <p className="text-white text-xs font-semibold text-center line-clamp-2">{img.alt_text || img.name}</p>
                          <div className="flex gap-2 mt-1" onClick={e => e.stopPropagation()}>
                            <a href={img.url} target="_blank" rel="noopener noreferrer"
                              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button onClick={() => deleteGalleryImage(img)} disabled={deletingId === img.id}
                              className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors">
                              {deletingId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Selected tick */}
                        {editingImg?.id === img.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Panel */}
              <AnimatePresence>
                {editingImg && editDraft && (
                  <motion.div
                    key="edit-panel"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className="w-72 shrink-0 bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden"
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a3142]">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-white">Edit Image</span>
                      </div>
                      <button onClick={() => { setEditingImg(null); setEditDraft(null); }}
                        className="p-1 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-[#2a3142]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-[#111520]">
                      <img src={editingImg.url} alt={editDraft.alt_text || editDraft.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-4 space-y-4">

                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Image Title</label>
                        <input
                          value={editDraft.name}
                          onChange={e => setEditDraft(d => d ? { ...d, name: e.target.value } : d)}
                          className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder="e.g. Front Bumper Repair"
                        />
                      </div>

                      {/* Alt Text */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Caption / Alt Text</label>
                        <input
                          value={editDraft.alt_text}
                          onChange={e => setEditDraft(d => d ? { ...d, alt_text: e.target.value } : d)}
                          className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder="Shown on hover in gallery"
                        />
                      </div>

                      {/* Preset Tags */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Filter Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {['before', 'after', 'process', 'finish', 'towing', 'paint'].map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase border transition-all ${
                                editDraft.tags.includes(tag)
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-[#111520] text-slate-400 border-[#2a3142] hover:border-primary/50 hover:text-white'
                              }`}
                            >
                              {editDraft.tags.includes(tag) && <span className="mr-1">✓</span>}{tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Tag */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Custom Tag</label>
                        <div className="flex gap-2">
                          <input
                            value={customTagInput}
                            onChange={e => setCustomTagInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
                            className="flex-1 bg-[#111520] border border-[#2a3142] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g. luxury"
                          />
                          <button onClick={addCustomTag}
                            className="px-3 py-2 bg-[#2a3142] hover:bg-primary text-slate-300 hover:text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Current tags */}
                        {editDraft.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {editDraft.tags.map(t => (
                              <span key={t}
                                className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-xs rounded-full font-medium">
                                {t}
                                <button onClick={() => setEditDraft(d => d ? { ...d, tags: d.tags.filter(x => x !== t) } : d)}
                                  className="hover:text-white transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sort Order */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Sort Order</label>
                        <input
                          type="number"
                          value={editDraft.sort_order}
                          onChange={e => setEditDraft(d => d ? { ...d, sort_order: Number(e.target.value) } : d)}
                          className="w-full bg-[#111520] border border-[#2a3142] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                        <p className="text-slate-600 text-[10px] mt-1">Lower number = shown first</p>
                      </div>

                      {/* Save */}
                      <button
                        onClick={saveImageEdit}
                        disabled={editSaving}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-60 text-sm"
                      >
                        {editSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-6">

            {settingsLoading ? (
              <div className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" /><p className="text-slate-400">Loading settings…</p></div>
            ) : (
              <>
                {/* General */}
                <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a3142]">
                    <h3 className="font-bold text-white">General</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Business name, contact info, and address</p>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Site Name">
                      <input className={inp} value={settingsDraft.general.site_name} onChange={e => patchDraft('general', 'site_name', e.target.value)} />
                    </Field>
                    <Field label="Tagline">
                      <input className={inp} value={settingsDraft.general.tagline} onChange={e => patchDraft('general', 'tagline', e.target.value)} />
                    </Field>
                    <Field label="Phone">
                      <input className={inp} value={settingsDraft.general.phone} onChange={e => patchDraft('general', 'phone', e.target.value)} />
                    </Field>
                    <Field label="Fax">
                      <input className={inp} value={settingsDraft.general.fax} onChange={e => patchDraft('general', 'fax', e.target.value)} />
                    </Field>
                    <Field label="Email">
                      <input type="email" className={inp} value={settingsDraft.general.email} onChange={e => patchDraft('general', 'email', e.target.value)} />
                    </Field>
                    <Field label="Address">
                      <input className={inp} value={settingsDraft.general.address} onChange={e => patchDraft('general', 'address', e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* Branding */}
                <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a3142]">
                    <h3 className="font-bold text-white">Branding</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Logo URL, colors, and hero text</p>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Logo URL">
                      <div className="flex gap-2">
                        <input className={inp} placeholder="https://…" value={settingsDraft.branding.logo_url ?? ''} onChange={e => patchDraft('branding', 'logo_url', e.target.value || null)} />
                        {settingsDraft.branding.logo_url && (
                          <a href={settingsDraft.branding.logo_url} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center justify-center w-10 bg-[#111520] border border-[#2a3142] rounded-xl text-slate-400 hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs mt-1.5">Upload to Gallery first, then paste the image URL here</p>
                    </Field>
                    <Field label="Favicon URL">
                      <input className={inp} placeholder="https://…" value={settingsDraft.branding.favicon_url ?? ''} onChange={e => patchDraft('branding', 'favicon_url', e.target.value || null)} />
                    </Field>
                    <Field label="Primary Color">
                      <div className="flex gap-3 items-center">
                        <input type="color" value={settingsDraft.branding.primary_color}
                          onChange={e => patchDraft('branding', 'primary_color', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-[#2a3142] bg-[#111520] cursor-pointer p-1" />
                        <input className={`${inp} flex-1`} value={settingsDraft.branding.primary_color} onChange={e => patchDraft('branding', 'primary_color', e.target.value)} />
                      </div>
                    </Field>
                    <Field label="Hero Tagline">
                      <input className={inp} placeholder="Optional override for hero section" value={settingsDraft.branding.hero_tagline ?? ''} onChange={e => patchDraft('branding', 'hero_tagline', e.target.value || null)} />
                    </Field>
                  </div>
                </div>

                {/* Social */}
                <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a3142]">
                    <h3 className="font-bold text-white">Social Links</h3>
                    <p className="text-slate-500 text-xs mt-0.5">External profile URLs</p>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(['facebook', 'instagram', 'google_maps', 'yelp'] as const).map(key => (
                      <div key={key}>
                        <Field label={key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}>
                          <input className={inp} placeholder="https://…" value={settingsDraft.social[key] ?? ''}
                            onChange={e => patchDraft('social', key, e.target.value || null)} />
                        </Field>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a3142]">
                    <h3 className="font-bold text-white">Email Notifications</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Control who receives emails when a form is submitted</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <Field label="Admin Notification Email">
                      <input type="email" className={inp} value={settingsDraft.notifications.admin_email}
                        onChange={e => patchDraft('notifications', 'admin_email', e.target.value)} />
                    </Field>
                    <div className="flex flex-col gap-3">
                      {([
                        { key: 'send_user_emails',  label: 'Send confirmation email to user',  desc: 'Users receive a confirmation when they submit a form' },
                        { key: 'send_admin_emails', label: 'Send notification email to admin', desc: 'Admin receives an alert for every new lead, contact, or quote' },
                      ] as const).map(({ key, label, desc }) => (
                        <label key={key} className="flex items-start gap-4 p-4 bg-[#111520] border border-[#2a3142] rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                          <button type="button" onClick={() => patchDraft('notifications', key, !settingsDraft.notifications[key])}
                            className={`shrink-0 mt-0.5 transition-colors ${settingsDraft.notifications[key] ? 'text-primary' : 'text-slate-600'}`}>
                            {settingsDraft.notifications[key]
                              ? <ToggleRight className="w-8 h-8" />
                              : <ToggleLeft className="w-8 h-8" />}
                          </button>
                          <div>
                            <p className="text-white text-sm font-semibold">{label}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save */}
                <div className="flex justify-end">
                  <button onClick={saveSettings} disabled={settingsSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
                    {settingsSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Settings</>}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── LEAD MODAL ── */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLead(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a3142]">
                <div><h3 className="text-xl font-bold text-white">{selectedLead.name}</h3><p className="text-slate-400 text-sm mt-0.5">{fmt(selectedLead.created_at)}</p></div>
                <button onClick={() => setSelectedLead(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a3142] text-slate-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Phone</p><a href={`tel:${selectedLead.phone}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-primary shrink-0" />{selectedLead.phone}</a></div>
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email</p>{selectedLead.email ? <a href={`mailto:${selectedLead.email}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-primary shrink-0" /><span className="truncate">{selectedLead.email}</span></a> : <span className="text-slate-500 text-sm">Not provided</span>}</div>
                </div>
                <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Service</p><p className="text-white font-semibold capitalize">{selectedLead.service_type}</p></div>
                {selectedLead.message && <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Message</p><p className="text-slate-300 text-sm leading-relaxed">{selectedLead.message}</p></div>}
                <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex gap-2">
                    {(['new', 'contacted', 'closed'] as const).map(s => { const style = LEAD_STATUS[s]; return (
                      <button key={s} onClick={() => updateLeadStatus(selectedLead.id, s)} disabled={updatingId === selectedLead.id}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${selectedLead.status === s ? `${style.bg} ${style.text} ${style.border}` : 'bg-[#111520] text-slate-500 border-[#2a3142] hover:border-slate-500'}`}>{s}</button>
                    ); })}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#2a3142] flex justify-between items-center">
                <button onClick={() => deleteLead(selectedLead.id)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                <button onClick={() => setSelectedLead(null)} className="px-5 py-2 bg-[#2a3142] hover:bg-[#3a4152] text-white rounded-xl text-sm font-medium transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTACT MODAL ── */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedContact(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a3142]">
                <div><h3 className="text-xl font-bold text-white">{selectedContact.name}</h3><p className="text-slate-400 text-sm mt-0.5">{fmt(selectedContact.created_at)}</p></div>
                <button onClick={() => setSelectedContact(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a3142] text-slate-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email</p><a href={`mailto:${selectedContact.email}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-primary shrink-0" /><span className="truncate">{selectedContact.email}</span></a></div>
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Phone</p>{selectedContact.phone ? <a href={`tel:${selectedContact.phone}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-primary shrink-0" />{selectedContact.phone}</a> : <span className="text-slate-500 text-sm">Not provided</span>}</div>
                </div>
                {selectedContact.subject && <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Subject</p><p className="text-white font-semibold">{selectedContact.subject}</p></div>}
                <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Message</p><p className="text-slate-300 text-sm leading-relaxed">{selectedContact.message}</p></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex gap-2">
                    {(['new', 'read', 'replied'] as const).map(s => { const style = CONTACT_STATUS[s]; return (
                      <button key={s} onClick={() => updateContactStatus(selectedContact.id, s)} disabled={updatingId === selectedContact.id}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${selectedContact.status === s ? `${style.bg} ${style.text} ${style.border}` : 'bg-[#111520] text-slate-500 border-[#2a3142] hover:border-slate-500'}`}>{s}</button>
                    ); })}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#2a3142] flex justify-between items-center">
                <button onClick={() => deleteContact(selectedContact.id)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                <button onClick={() => setSelectedContact(null)} className="px-5 py-2 bg-[#2a3142] hover:bg-[#3a4152] text-white rounded-xl text-sm font-medium transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── QUOTE MODAL ── */}
      <AnimatePresence>
        {selectedQuote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedQuote(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a3142]">
                <div><h3 className="text-xl font-bold text-white">{selectedQuote.name}</h3><p className="text-slate-400 text-sm mt-0.5">{fmt(selectedQuote.created_at)}</p></div>
                <button onClick={() => setSelectedQuote(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a3142] text-slate-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Phone</p><a href={`tel:${selectedQuote.phone}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-primary shrink-0" />{selectedQuote.phone}</a></div>
                  <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email</p><a href={`mailto:${selectedQuote.email}`} className="text-white font-semibold hover:text-primary transition-colors flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-primary shrink-0" /><span className="truncate">{selectedQuote.email}</span></a></div>
                </div>
                <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Vehicle</p>
                  <p className="text-white font-semibold">{[selectedQuote.vehicle_year, selectedQuote.vehicle_make, selectedQuote.vehicle_model].filter(Boolean).join(' ') || '—'}</p>
                  {selectedQuote.vehicle_color && <p className="text-slate-400 text-sm mt-1">Color: {selectedQuote.vehicle_color}</p>}
                </div>
                {selectedQuote.damage_description && <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Damage</p><p className="text-slate-300 text-sm leading-relaxed">{selectedQuote.damage_description}</p></div>}
                <div className="grid grid-cols-2 gap-4">
                  {selectedQuote.service_needed && <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Service</p><p className="text-white text-sm font-semibold">{selectedQuote.service_needed}</p></div>}
                  {selectedQuote.estimated_budget && <div className="bg-[#111520] rounded-xl p-4 border border-[#2a3142]"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Est. Budget</p><p className="text-white text-sm font-semibold">{selectedQuote.estimated_budget}</p></div>}
                </div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['new', 'quoted', 'approved', 'completed', 'declined'] as const).map(s => { const style = QUOTE_STATUS[s]; return (
                      <button key={s} onClick={() => updateQuoteStatus(selectedQuote.id, s)} disabled={updatingId === selectedQuote.id}
                        className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${selectedQuote.status === s ? `${style.bg} ${style.text} ${style.border}` : 'bg-[#111520] text-slate-500 border-[#2a3142] hover:border-slate-500'}`}>{s}</button>
                    ); })}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#2a3142] flex justify-between items-center">
                <button onClick={() => deleteQuote(selectedQuote.id)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                <button onClick={() => setSelectedQuote(null)} className="px-5 py-2 bg-[#2a3142] hover:bg-[#3a4152] text-white rounded-xl text-sm font-medium transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
