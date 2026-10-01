import { useState } from "react";
import {
  ArrowLeft,
  ScanLine,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

function Scanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeUrl = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/scan",
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
        throw new Error("Failed to analyze URL");
      }

      const data = await response.json();

      setResult(data);

      // Save successful scan to history
      try {
        await fetch(
          "http://127.0.0.1:8000/api/history/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: data.url || url.trim(),
              verdict: data.verdict,
              risk_score: data.risk_score,
              risk_level: data.risk_level,
            }),
          }
        );
      } catch (historyError) {
        console.error(
          "Failed to save scan history:",
          historyError
        );
      }
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
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400">
            <ScanLine size={18} />
            AI THREAT ANALYSIS
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            URL Threat Scanner
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Analyze a suspicious URL before you trust it.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Scan a URL
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the website URL you want ThreatLens AI to
              analyze.
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
                analyzeUrl();
              }
            }}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
          />

          <div className="mt-5 flex justify-end">
            <button
              onClick={analyzeUrl}
              disabled={loading || !url.trim()}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ScanLine size={18} />

              {loading ? "Analyzing..." : "Analyze URL"}
            </button>
          </div>
        </section>

        {result && !result.error && (
          <section className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                {result.risk_level === "High Risk" ? (
                  <AlertTriangle
                    className="text-red-400"
                    size={24}
                  />
                ) : (
                  <ShieldCheck
                    className={
                      result.risk_level === "Medium Risk"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }
                    size={24}
                  />
                )}

                <div>
                  <p className="text-xs font-medium tracking-widest text-cyan-400">
                    THREAT ANALYSIS COMPLETE
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {result.verdict}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
                  <p className="text-xs text-slate-500">
                    Risk Score
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {result.risk_score}/100
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
                  <p className="text-xs text-slate-500">
                    Risk Level
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {result.risk_level}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#080b12] p-5">
                <p className="text-xs text-slate-500">
                  Analyzed URL
                </p>

                <p className="mt-2 break-all text-sm text-slate-300">
                  {result.url || url}
                </p>
              </div>

              {result.reasons?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold">
                    Security Analysis
                  </h3>

                  <div className="mt-3 space-y-3">
                    {result.reasons.map((reason, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300"
                      >
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

export default Scanner;