import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const CHATBOT_ID = 'HSVa6A981guylSzcM-zvK';

declare global {
  interface Window {
    chatbase: ((...args: unknown[]) => unknown) & { q?: unknown[][] };
  }
}

export default function ChatbaseWidget() {
  const { user } = useAuth();

  // ── embed script (matches Chatbase's exact snippet) ───────
  useEffect(() => {
    if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
      window.chatbase = (...args: unknown[]) => {
        if (!window.chatbase.q) window.chatbase.q = [];
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === 'q') return target.q;
          return (...args: unknown[]) => target(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      if (document.getElementById(CHATBOT_ID)) return;
      const script = document.createElement('script');
      script.src    = 'https://www.chatbase.co/embed.min.js';
      script.id     = CHATBOT_ID;
      (script as HTMLScriptElement & { domain: string }).domain = 'www.chatbase.co';
      document.body.appendChild(script);
    };

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, []);

  // ── identify logged-in user with Chatbase ─────────────────
  useEffect(() => {
    if (!user) return;

    const identify = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbase-token`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );
        if (!res.ok) return;
        const { token } = await res.json() as { token: string };
        window.chatbase?.('identify', { token });
      } catch {
        // non-critical — chatbot still works without identity
      }
    };

    // small delay so the chatbase script is loaded first
    const t = setTimeout(identify, 2500);
    return () => clearTimeout(t);
  }, [user]);

  return null;
}
