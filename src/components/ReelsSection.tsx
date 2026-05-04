import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, VolumeX, X, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Reel {
  id: string;
  title: string | null;
  caption: string | null;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

interface MediaRow {
  id: string;
  name: string;
  url: string;
  alt_text: string | null;
  mime_type: string | null;
  created_at: string;
}

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i;

function isVideo(row: MediaRow): boolean {
  if (row.mime_type && row.mime_type.startsWith('video/')) return true;
  return VIDEO_EXT_RE.test(row.url);
}

export default function ReelsSection() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('id, name, url, alt_text, mime_type, created_at')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error || !data) {
        setReels([]);
      } else {
        const videos = (data as MediaRow[]).filter(isVideo).map<Reel>((row) => ({
          id: row.id,
          title: row.name,
          caption: row.alt_text,
          video_url: row.url,
          thumbnail_url: null,
          created_at: row.created_at,
        }));
        setReels(videos);
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded || reels.length === 0) return null;

  return (
    <section className="mt-32">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Workshop Reels</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Watch us work.
          </h2>
        </div>
        <p className="text-slate-500 text-sm hidden md:block max-w-xs">
          Tap any reel for the full vertical feed.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {reels.map((reel, i) => (
          <ReelThumb key={reel.id} reel={reel} onClick={() => setActiveIdx(i)} />
        ))}
      </div>

      <AnimatePresence>
        {activeIdx !== null && (
          <ReelViewer
            reels={reels}
            startIndex={activeIdx}
            onClose={() => setActiveIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

const ReelThumb: FC<{ reel: Reel; onClick: () => void }> = ({ reel, onClick }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLButtonElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.4),
      { threshold: [0, 0.4, 0.8] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  return (
    <button
      ref={wrapRef}
      onClick={onClick}
      className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-slate-900 group focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <video
        ref={videoRef}
        src={reel.video_url}
        poster={reel.thumbnail_url ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <Play className="w-4 h-4 text-white fill-white" />
      </div>
      {reel.title && (
        <div className="absolute bottom-3 left-3 right-3 text-left">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2 drop-shadow">
            {reel.title}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
    </button>
  );
};

const ReelViewer: FC<{
  reels: Reel[];
  startIndex: number;
  onClose: () => void;
}> = ({ reels, startIndex, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [activeIdx, setActiveIdx] = useState(startIndex);

  useEffect(() => {
    const el = containerRef.current?.children[startIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
  }, [startIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        const next = Math.min(activeIdx + 1, reels.length - 1);
        const el = containerRef.current?.children[next] as HTMLElement | undefined;
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp') {
        const prev = Math.max(activeIdx - 1, 0);
        const el = containerRef.current?.children[prev] as HTMLElement | undefined;
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, reels.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/70 to-transparent">
        <span className="text-white font-bold tracking-tight">Reels</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {reels.map((reel, i) => (
          <ReelSlide
            key={reel.id}
            reel={reel}
            muted={muted}
            onActive={() => setActiveIdx(i)}
          />
        ))}
      </div>
    </motion.div>
  );
};

const ReelSlide: FC<{
  reel: Reel;
  muted: boolean;
  onActive: () => void;
}> = ({ reel, muted, onActive }) => {
  const slideRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.6;
        setInView(visible);
        if (visible) onActive();
      },
      { threshold: [0, 0.6, 0.95] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onActive]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (inView && !paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, muted, paused]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  return (
    <div
      ref={slideRef}
      className="h-screen w-full snap-start snap-always relative flex items-center justify-center"
    >
      {/* Video — vertical, centered, contained */}
      <div
        className="relative h-full max-h-screen aspect-[9/16] max-w-full bg-black flex items-center justify-center"
        onClick={() => setPaused((p) => !p)}
      >
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.thumbnail_url ?? undefined}
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Pause overlay */}
        <AnimatePresence>
          {paused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom caption */}
        <div className="absolute bottom-0 inset-x-0 p-5 pb-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm">
              AM
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">@AMCollision</p>
              <p className="text-white/60 text-xs">AM Collision &amp; Towing</p>
            </div>
          </div>
          {reel.title && (
            <p className="text-white font-bold text-base leading-tight mb-1">{reel.title}</p>
          )}
          {reel.caption && (
            <p className="text-white/85 text-sm leading-relaxed line-clamp-3">{reel.caption}</p>
          )}
        </div>

        {/* Right action rail */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked((l) => !l);
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
              <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow">
              {liked ? '1' : '0'}
            </span>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow">0</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: reel.title ?? 'Reel', url: window.location.href }).catch(() => {});
              }
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
              <Send className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow">Share</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked((b) => !b);
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
              <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-white' : ''} text-white`} />
            </div>
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/15">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
