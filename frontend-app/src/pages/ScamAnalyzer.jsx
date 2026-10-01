import { useState } from "react";
import {
  ArrowLeft,
  MessageSquareWarning,
  ShieldCheck,
  AlertTriangle,
  ScanLine,
} from "lucide-react";

function ScamAnalyzer() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/scam/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze message");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        verdict: "Analysis Failed",
        risk_score: 0,
        risk_level: "Unavailable",
        reasons: [
          "Unable to connect to ThreatLens AI backend.",
          "Make sure the FastAPI server is running on port 8000.",
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "text-red-400";
    if (score >= 40) return "text-amber-400";
    return "text-emerald-400";
  };

  const getRiskBarColor = (score) => {
    if (score >= 70) return "bg-red-400";
    if (score >= 40) return "bg-amber-400";
    return "bg-emerald-400";
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
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
        {/* Intro */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-400">
            <MessageSquareWarning size={18} />
            AI SECURITY ANALYZER
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Scam Message Detector
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Analyze suspicious SMS, WhatsApp messages, job offers and online
            messages for common scam indicators before you respond.
          </p>
        </div>

        {/* Analyzer Card */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Analyze a Message
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Paste the suspicious message below.
            </p>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: Congratulations! You have won a cash prize. Claim your reward immediately..."
            className="min-h-[220px] w-full resize-none rounded-xl border border-white/10 bg-[#080b12] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
          />

          <div className="mt-5 flex justify-end">
            <button
              onClick={analyzeMessage}
              disabled={loading || !message.trim()}
              className="flex items-center gap-2 rounded-xl bg-violet-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ScanLine size={18} />
              {loading ? "Analyzing..." : "Analyze Message"}
            </button>
          </div>
        </section>

        {/* Result */}
        {result && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="mb-7 flex items-center gap-3">
              {result.risk_score >= 70 ? (
                <AlertTriangle className="text-red-400" size={22} />
              ) : (
                <ShieldCheck className="text-emerald-400" size={22} />
              )}

              <div>
                <p className="text-xs font-medium tracking-widest text-violet-400">
                  MESSAGE ANALYSIS COMPLETE
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {result.verdict}
                </h2>
              </div>
            </div>

            {/* Score */}
            <div className="rounded-xl border border-white/10 bg-[#080b12] p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Risk Score
                  </p>

                  <p
                    className={`mt-1 text-4xl font-semibold ${getRiskColor(
                      result.risk_score
                    )}`}
                  >
                    {result.risk_score}
                    <span className="text-lg text-slate-500">
                      /100
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    Risk Level
                  </p>

                  <p
                    className={`mt-1 font-medium ${getRiskColor(
                      result.risk_score
                    )}`}
                  >
                    {result.risk_level}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${getRiskBarColor(
                    result.risk_score
                  )}`}
                  style={{
                    width: `${result.risk_score}%`,
                  }}
                />
              </div>
            </div>

            {/* Reasons */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold">
                Detection Reasons
              </h3>

              <div className="mt-3 space-y-3">
                {result.reasons?.map((reason, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300"
                  >
                    <span className="mr-2 text-violet-400">•</span>
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ScamAnalyzer;