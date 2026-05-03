export default function PixelCatchHome() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/70 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          Chrome Extension · macOS
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-none">
          Pixel<span className="text-red-500">Catch</span>
        </h1>

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed">
          Download YouTube videos — including Premium streams and members-only
          uploads — entirely on your Mac. No servers. No tracking. Just your files.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl transition-colors text-sm"
          >
            Add to Chrome
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-colors text-sm"
          >
            How it works
          </a>
        </div>
      </section>

      {/* What you can download */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="text-2xl font-bold mb-10 text-center">What you can download</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Public videos", detail: "480p · 720p · 1080p · 1440p · 4K" },
            { label: "YouTube Premium streams", detail: "Enhanced 1080p bitrate (requires active Premium)" },
            { label: "Members-only uploads", detail: "For channels you're an active member of" },
            { label: "Audio-only tracks", detail: "m4a — music, podcasts, lectures" },
          ].map(({ label, detail }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-white">{label}</p>
                  <p className="text-sm text-white/50 mt-0.5">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
        <div className="flex flex-col gap-6">
          {[
            { step: "1", title: "Click the toolbar icon", desc: "Open the PixelCatch panel in your browser." },
            { step: "2", title: "Paste a YouTube URL", desc: "Any public, Premium, or members-only video you have access to." },
            { step: "3", title: "Pick a quality preset", desc: "480p, 720p, 1080p, 1440p, or 4K." },
            { step: "4", title: "Click Download", desc: "The file lands in ~/Downloads. Everything runs locally via yt-dlp." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-5 bg-white/5 border border-white/10 rounded-xl p-5">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-red-500/20 text-red-400 font-black text-sm flex items-center justify-center">
                {step}
              </span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-white/50 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy callout */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">100 % local. Zero tracking.</h2>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            PixelCatch makes zero network requests of its own. Downloads go directly
            from YouTube's servers to your Mac through a local yt-dlp helper.
            No analytics, no account integration, no third-party scripts.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/40">
            <span>No identity permission</span>
            <span>·</span>
            <span>No remote server</span>
            <span>·</span>
            <span>Logs at 0600</span>
            <span>·</span>
            <span>Strict URL allow-list</span>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="text-2xl font-bold mb-8 text-center">Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { req: "macOS", note: "Any recent version" },
            { req: "Python 3.8+", note: "Pre-installed on most Macs" },
            { req: "yt-dlp", note: "brew install yt-dlp" },
            { req: "Chrome + signed-in YouTube", note: "For Premium / members-only content" },
          ].map(({ req, note }) => (
            <div key={req} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex justify-between items-center">
              <span className="font-semibold">{req}</span>
              <span className="text-white/40">{note}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-white/40 text-sm mt-8">
          After loading the extension, run{" "}
          <code className="bg-white/10 px-2 py-0.5 rounded text-white/70">./native/install.sh &lt;your-extension-id&gt;</code>{" "}
          in the extension folder to install the native helper.
        </p>
      </section>

      {/* Footer links */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/30">
        <div className="flex justify-center gap-8">
          <a href="/extensions/pixel-catch/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/extensions/pixel-catch/terms-and-conditions" className="hover:text-white transition-colors">
            Terms &amp; Conditions
          </a>
          <a href="mailto:link2dawood123@gmail.com" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} PixelCatch</p>
      </footer>

    </div>
  );
}
