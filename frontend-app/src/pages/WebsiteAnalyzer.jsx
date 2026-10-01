import { useState } from "react";
import {
  ArrowLeft,
  Globe2,
  ShieldCheck,
  AlertTriangle,
  ScanLine,
  Server,
  Lock,
  GitBranch,
} from "lucide-react";

function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeWebsite = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/website/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze website");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        error:
          "Unable to connect to ThreatLens AI backend. Make sure the FastAPI server is running on port 8000.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#080b12]/80">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-5">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-400">
            <Globe2 size={18} />
            WEBSITE SECURITY ANALYZER
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Website Security Analyzer
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Inspect a website's connection, redirects and security headers
            before you trust it.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Analyze a Website
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the website URL you want ThreatLens AI to inspect.
            </p>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Website URL
          </label>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                analyzeWebsite();
              }
            }}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
          />

          <div className="mt-5 flex justify-end">
            <button
              onClick={analyzeWebsite}
              disabled={loading || !url.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ScanLine size={18} />
              {loading ? "Analyzing..." : "Analyze Website"}
            </button>
          </div>
        </section>

        {result && !result.error && (
          <section className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                {result.https ? (
                  <ShieldCheck
                    className="text-emerald-400"
                    size={24}
                  />
                ) : (
                  <AlertTriangle
                    className="text-red-400"
                    size={24}
                  />
                )}

                <div>
                  <p className="text-xs font-medium tracking-widest text-blue-400">
                    WEBSITE ANALYSIS COMPLETE
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {result.https
                      ? "Secure Connection Detected"
                      : "Connection Requires Attention"}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
                  <div className="flex items-center gap-3">
                    <Lock
                      size={20}
                      className={
                        result.https
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        HTTPS
                      </p>

                      <p className="mt-1 font-medium">
                        {result.https
                          ? "Enabled"
                          : "Not Enabled"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
                  <div className="flex items-center gap-3">
                    <GitBranch
                      size={20}
                      className={
                        result.redirected
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        Redirect Status
                      </p>

                      <p className="mt-1 font-medium">
                        {result.redirected
                          ? "Redirected"
                          : "No Redirect"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
                  <div className="flex items-center gap-3">
                    <Server
                      size={20}
                      className="text-blue-400"
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        HTTP Status
                      </p>

                      <p className="mt-1 font-medium">
                        {result.status_code ?? "Unavailable"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
                  <div className="flex items-center gap-3">
                    <Globe2
                      size={20}
                      className="text-violet-400"
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        Server
                      </p>

                      <p className="mt-1 font-medium">
                        {result.server || "Not disclosed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#080b12] p-5">
                <p className="text-sm text-slate-500">
                  Final URL
                </p>

                <p className="mt-2 break-all text-sm text-slate-300">
                  {result.final_url}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold">
                  Security Headers
                </h3>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {Object.entries(result.security_headers || {}).map(
                    ([header, enabled]) => (
                      <div
                        key={header}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4"
                      >
                        <span className="text-sm text-slate-300">
                          {header}
                        </span>

                        <span
                          className={
                            enabled
                              ? "text-sm font-medium text-emerald-400"
                              : "text-sm font-medium text-slate-500"
                          }
                        >
                          {enabled ? "Present" : "Missing"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {result?.error && (
          <section className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 text-red-400"
                size={20}
              />

              <div>
                <h2 className="font-semibold">
                  Analysis Failed
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {result.error}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default WebsiteAnalyzer;