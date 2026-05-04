export default function PixelCatchPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <section className="max-w-3xl mx-auto px-6 pt-20 md:pt-28 pb-20">
        <div className="mb-10">
          <a
            href="/extensions/pixel-catch"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            &larr; PixelCatch
          </a>
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/40 mb-1">Product: PixelCatch — YouTube Video Downloader</p>
        <p className="text-sm text-white/40 mb-12">Last updated: May 4, 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Overview</h2>
            <p>
              PixelCatch is a Chrome extension with a single purpose: download YouTube videos
              to your Mac using a local <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">yt-dlp</code> helper.
              This Privacy Policy explains what data we handle (effectively none) and your rights
              as a user, in accordance with the Chrome Web Store User Data Policy and applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Data We Do Not Collect</h2>
            <p>PixelCatch does not collect, transmit, sell, or share any of the following:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Personally identifiable information (name, email, address, phone)</li>
              <li>Authentication or financial information (passwords, OAuth tokens, payment details)</li>
              <li>Health, location, or any sensitive personal information</li>
              <li>Personal communications (email content, chats, messages)</li>
              <li>Web browsing history, search history, or YouTube watch history</li>
              <li>The URLs you paste into the extension or the quality presets you choose</li>
              <li>User activity, clicks, mouse movements, scroll events, or keystrokes</li>
              <li>IP addresses, device identifiers, advertising IDs, or fingerprinting data</li>
              <li>Crash reports, telemetry, or analytics of any kind</li>
            </ul>
            <p className="mt-3">
              The extension declares <strong>no</strong> <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">identity</code> permission
              and makes <strong>zero</strong> outbound network requests of its own. It does not
              run on or read content from any web page; it only opens its own popup UI.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Permissions Used &amp; Why</h2>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>nativeMessaging</strong> — required to talk to the local helper process
                (<code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">com.pixelcatch.downloader</code>) on your Mac, which runs
                yt-dlp. This communication is local-only; nothing is sent over the internet by the extension.
              </li>
              <li>
                <strong>storage</strong> — used only to remember your last-used quality preset on your own device.
                Stored locally; never synced to any server.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. How PixelCatch Works</h2>
            <p>When you click Download, the following happens entirely on your device:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-2">
              <li>The popup passes the URL and quality preset to the native helper via Chrome's local Native Messaging API.</li>
              <li>The helper validates the URL host (must be a YouTube domain) and the quality preset against a strict allow-list, then invokes <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">yt-dlp</code> locally.</li>
              <li>yt-dlp uses your already-signed-in Chrome session cookies to authenticate with YouTube. PixelCatch does not read, store, copy, or transmit your cookies or credentials.</li>
              <li>The file is saved to <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">~/Downloads</code>. A log entry is written to <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">~/Library/Logs/com.pixelcatch.downloader.log</code> (Unix mode 0600 — readable only by your macOS user account).</li>
            </ol>
            <p className="mt-3">
              No data leaves your machine through PixelCatch at any point in this flow.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Compliance with Chrome Web Store Policies</h2>
            <p>
              We affirm that PixelCatch's use of any information received from Chrome APIs adheres
              to the <a className="text-red-400 underline" href="https://developer.chrome.com/docs/webstore/program-policies/limited-use" target="_blank" rel="noopener noreferrer">Chrome Web Store User Data Policy</a>,
              including the Limited Use requirements. Specifically: PixelCatch does not transfer user data
              to third parties, does not use user data for advertising, does not allow humans to read user
              data, and does not use user data for purposes unrelated to its single, narrow purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Local Log Files</h2>
            <p>
              The native helper writes operational logs to{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">~/Library/Logs/com.pixelcatch.downloader.log</code>.
              These logs help you troubleshoot failed downloads. The file is created with Unix permission 0600
              (owner-only). PixelCatch never reads, uploads, or transmits this file.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Third-Party Services</h2>
            <p>
              PixelCatch contains no third-party analytics, advertising, or tracking SDKs. The native helper
              ships no telemetry.
            </p>
            <p className="mt-3">
              <strong>yt-dlp</strong> is an open-source command-line tool you install independently
              (e.g., <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">brew install yt-dlp</code>).
              Its privacy practices are governed by its own project; we have no affiliation with or control over it.
            </p>
            <p className="mt-3">
              Downloads transit directly from YouTube's servers to your Mac. YouTube's own Privacy Policy
              governs that data exchange.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Data Retention &amp; Deletion</h2>
            <p>
              Because PixelCatch does not collect user data, there is nothing for us to retain or delete on
              your behalf. To remove all local PixelCatch data, uninstall the extension and delete the log
              file at <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">~/Library/Logs/com.pixelcatch.downloader.log</code>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Children's Privacy</h2>
            <p>
              PixelCatch is not directed at children under 13 (or under 16 in the EU/UK). We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              If we materially change our data practices, we will update this page and revise the
              "Last updated" date. Continued use after changes are posted constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
            <p>
              Questions about this Privacy Policy? Email{" "}
              <a href="mailto:dawood.dixeam@gmail.com" className="text-red-400 underline">
                dawood.dixeam@gmail.com
              </a>{" "}
              or visit the{" "}
              <a href="/extensions/pixel-catch/support" className="text-red-400 underline">
                Support page
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 text-sm text-white/40">
          <a href="/extensions/pixel-catch" className="hover:text-white transition-colors">Home</a>
          <a href="/extensions/pixel-catch/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
          <a href="/extensions/pixel-catch/support" className="hover:text-white transition-colors">Support</a>
        </div>
      </section>
    </div>
  );
}
