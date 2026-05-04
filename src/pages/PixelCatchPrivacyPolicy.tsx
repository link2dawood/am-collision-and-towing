export default function PixelCatchPrivacyPolicy() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-2">Product: PixelCatch — YouTube Video Downloader</p>
        <p className="text-sm text-slate-500 mb-10">Last updated: May 4, 2025</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Overview</h2>
            <p>
              PixelCatch is a browser extension that lets you download YouTube videos — including Premium-bitrate
              streams and channel members-only uploads — entirely on your own machine. This Privacy Policy explains
              what data we collect (very little), what we do not collect (almost everything), and your rights as a user.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Data We Do Not Collect</h2>
            <p>PixelCatch is designed to be zero-data. Specifically, we never collect or transmit:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your Google account identity, email address, or any OAuth token</li>
              <li>Your YouTube watch history, search history, or subscription list</li>
              <li>Download history, URLs you paste, or quality selections you make</li>
              <li>Browsing activity, cookies, or session data</li>
              <li>IP addresses, device identifiers, or location information</li>
              <li>Crash reports, telemetry, or analytics of any kind</li>
            </ul>
            <p className="mt-3">
              The extension declares <strong>no</strong> <code>identity</code> permission in its manifest and
              makes <strong>zero</strong> outbound network requests itself. All download activity is handled
              by the native helper process running locally on your Mac.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How PixelCatch Works</h2>
            <p>When you click Download, the following happens entirely on your device:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-2">
              <li>The extension popup passes the URL and quality preset to the native messaging host (<code>com.pixelcatch.downloader</code>) via Chrome's local native messaging API.</li>
              <li>The native helper validates the URL host and quality preset against a strict allow-list, then invokes <code>yt-dlp</code> locally.</li>
              <li><code>yt-dlp</code> uses your already-signed-in Chrome session cookies to authenticate with YouTube. No credentials are stored by PixelCatch.</li>
              <li>The file is saved to <code>~/Downloads</code>. A log entry is written to <code>~/Library/Logs/com.pixelcatch.downloader.log</code> (mode 0600 — readable only by you).</li>
            </ol>
            <p className="mt-3">
              No data leaves your machine through PixelCatch at any point in this process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Local Log Files</h2>
            <p>
              The native helper writes operational logs to{" "}
              <code>~/Library/Logs/com.pixelcatch.downloader.log</code>. These logs record download
              events and errors to help you troubleshoot issues. The log file is created with
              Unix permission 0600, so only your macOS user account can read it. We never read,
              upload, or access this file.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Third-Party Services</h2>
            <p>
              PixelCatch does not integrate with any third-party analytics, advertising, or data-collection
              service. The extension contains no third-party scripts. The native helper ships no telemetry SDK.
            </p>
            <p className="mt-3">
              <strong>yt-dlp</strong> is an open-source command-line tool you install independently
              (e.g., via <code>brew install yt-dlp</code>). Its privacy practices are governed by
              its own project; we have no affiliation with or control over it.
            </p>
            <p className="mt-3">
              Downloads go directly from YouTube's servers to your Mac. YouTube's own Privacy Policy
              governs that data transfer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Children's Privacy</h2>
            <p>
              PixelCatch is not directed at children under 13 (or under 16 in the EU/UK). We do not
              knowingly collect any personal information from children. If you believe a child has used
              the extension in a way that generated personal data, please contact us and we will address it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Changes to This Policy</h2>
            <p>
              If we ever materially change our data practices, we will update this page and revise the
              "Last updated" date at the top. Continued use of PixelCatch after changes are posted
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Contact</h2>
            <p>
              Questions about this Privacy Policy? Email us at{" "}
              <a href="mailto:link2dawood123@gmail.com" className="text-blue-600 underline">
                link2dawood123@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
