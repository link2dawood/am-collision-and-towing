export default function PixelCatchSupport() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <a
            href="/extensions/pixel-catch"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            &larr; PixelCatch
          </a>
        </div>

        <h1 className="text-5xl font-black tracking-tight mb-3">Support</h1>
        <p className="text-white/50 mb-12">
          Need help with PixelCatch? You're in the right place.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-3">Contact</h2>
          <p className="text-white/70 mb-4 leading-relaxed">
            For bug reports, feature requests, install issues, or anything else,
            email the developer directly:
          </p>
          <a
            href="mailto:dawood.dixeam@gmail.com"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            dawood.dixeam@gmail.com
          </a>
          <p className="text-sm text-white/40 mt-4">
            Replies typically within 1–2 business days.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Common issues</h2>
          <div className="space-y-5 text-sm">
            <div>
              <p className="font-semibold text-white mb-1">"Native helper not found"</p>
              <p className="text-white/60 leading-relaxed">
                Run <code className="bg-white/10 px-2 py-0.5 rounded text-white/80">./native/install.sh &lt;your-extension-id&gt;</code>
                {" "}from the extension folder. Make sure <code className="bg-white/10 px-2 py-0.5 rounded text-white/80">yt-dlp</code>
                {" "}is installed (<code className="bg-white/10 px-2 py-0.5 rounded text-white/80">brew install yt-dlp</code>).
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Premium / members-only video won't download</p>
              <p className="text-white/60 leading-relaxed">
                Confirm you're signed into YouTube in the same Chrome profile and that your
                Premium subscription or channel membership is active. PixelCatch uses your
                existing browser session — it does not store credentials.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Download fails with a yt-dlp error</p>
              <p className="text-white/60 leading-relaxed">
                Update yt-dlp (<code className="bg-white/10 px-2 py-0.5 rounded text-white/80">brew upgrade yt-dlp</code>).
                YouTube changes its API often; the latest yt-dlp release usually has the fix.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Where do downloads go?</p>
              <p className="text-white/60 leading-relaxed">
                Files are saved to <code className="bg-white/10 px-2 py-0.5 rounded text-white/80">~/Downloads</code>.
                Logs are at <code className="bg-white/10 px-2 py-0.5 rounded text-white/80">~/Library/Logs/com.pixelcatch.downloader.log</code>{" "}
                (mode 0600 — readable only by you).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-3">Reporting a bug</h2>
          <p className="text-white/60 leading-relaxed text-sm">
            When emailing about a bug, please include: macOS version, Chrome version,
            the YouTube URL you were trying (if shareable), the exact error message,
            and the last few lines of <code className="bg-white/10 px-2 py-0.5 rounded text-white/80">~/Library/Logs/com.pixelcatch.downloader.log</code>.
            That gets us to a fix fastest.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/40">
          <a href="/extensions/pixel-catch" className="hover:text-white transition-colors">Home</a>
          <a href="/extensions/pixel-catch/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/extensions/pixel-catch/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
        </div>
      </section>
    </div>
  );
}
