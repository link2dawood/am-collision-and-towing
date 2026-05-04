export default function PixelCatchHome() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Chrome Extension · macOS
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-none">
          Pixel<span className="text-red-600">Catch</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-2 leading-relaxed">
          A single-purpose Chrome extension that downloads YouTube videos to your Mac
          using a local <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 text-base">yt-dlp</code> helper.
        </p>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          No servers. No analytics. Files go straight to your Downloads folder.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors text-sm"
          >
            How it works
          </a>
          <a
            href="/extensions/pixel-catch/support"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 font-bold px-8 py-4 rounded-xl transition-colors text-sm"
          >
            Support
          </a>
        </div>
      </section>

      {/* What you can download */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200">
        <h2 className="text-2xl font-bold mb-10 text-center">What you can download</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Public videos", detail: "480p · 720p · 1080p · 1440p · 4K" },
            { label: "YouTube Premium streams", detail: "Enhanced 1080p bitrate (requires active Premium)" },
            { label: "Members-only uploads", detail: "For channels you're an active member of" },
            { label: "Audio-only tracks", detail: "m4a — music, podcasts, lectures" },
          ].map(({ label, detail }) => (
            <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200">
        <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
        <div className="flex flex-col gap-6">
          {[
            { step: "1", title: "Click the toolbar icon", desc: "Open the PixelCatch panel in your browser." },
            { step: "2", title: "Paste a YouTube URL", desc: "Any public, Premium, or members-only video you have access to." },
            { step: "3", title: "Pick a quality preset", desc: "480p, 720p, 1080p, 1440p, or 4K." },
            { step: "4", title: "Click Download", desc: "The file lands in ~/Downloads. Everything runs locally via yt-dlp." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-5 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 text-red-600 font-black text-sm flex items-center justify-center">
                {step}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy callout */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">100 % local. Zero tracking.</h2>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            PixelCatch makes zero network requests of its own. Downloads go directly
            from YouTube's servers to your Mac through a local yt-dlp helper.
            No analytics, no account integration, no third-party scripts.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-500">
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
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200">
        <h2 className="text-2xl font-bold mb-8 text-center">Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { req: "macOS", note: "Any recent version" },
            { req: "Python 3.8+", note: "Pre-installed on most Macs" },
            { req: "yt-dlp", note: "brew install yt-dlp" },
            { req: "Chrome + signed-in YouTube", note: "For Premium / members-only content" },
          ].map(({ req, note }) => (
            <div key={req} className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 flex justify-between items-center">
              <span className="font-semibold text-slate-900">{req}</span>
              <span className="text-slate-500">{note}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">
          After loading the extension, run{" "}
          <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">./native/install.sh &lt;your-extension-id&gt;</code>{" "}
          in the extension folder to install the native helper.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          PixelCatch is an independent tool and is not affiliated with, endorsed by, or
          certified by Google LLC or YouTube. Use only with content you have a legal right
          to download. You are responsible for complying with YouTube's Terms of Service
          and applicable copyright law.
        </p>
      </section>

      {/* Footer links */}
      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <a href="/extensions/pixel-catch/privacy-policy" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </a>
          <a href="/extensions/pixel-catch/terms-and-conditions" className="hover:text-slate-900 transition-colors">
            Terms &amp; Conditions
          </a>
          <a href="/extensions/pixel-catch/support" className="hover:text-slate-900 transition-colors">
            Support
          </a>
          <a href="mailto:dawood.dixeam@gmail.com" className="hover:text-slate-900 transition-colors">
            dawood.dixeam@gmail.com
          </a>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} PixelCatch</p>
      </footer>

    </div>
  );
}
