import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function EmailAnalyzer() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeEmail = async () => {
    if (!subject.trim() && !body.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/email/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            body,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Email analysis failed");
      }

      setResult(data);
    } catch (error) {
      setResult({
        error:
          "Unable to connect to ThreatLens AI backend. Please make sure the backend server is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "text-red-400";
    if (score >= 40) return "text-yellow-400";
    return "text-emerald-400";
  };

  const getRiskBarColor = (score) => {
    if (score >= 70) return "bg-red-400";
    if (score >= 40) return "bg-yellow-400";
    return "bg-emerald-400";
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-4 py-2">
            <Mail size={16} className="text-cyan-400" />
            <span className="text-xs font-medium tracking-wide text-slate-300">
              EMAIL THREAT ANALYSIS
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-cyan-400">
            AI SECURITY ANALYZER
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Email Phishing Analyzer
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            Analyze suspicious emails and identify phishing indicators before
            interacting with them.
          </p>
        </div>

        {/* Analyzer Card */}
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <Mail size={20} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="font-medium text-white">Analyze an Email</h2>
              <p className="text-xs text-slate-500">
                Paste the email subject and message below
              </p>
            </div>
          </div>

          {/* Subject */}
          <div className="mt-7">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Urgent: Verify your account"
              className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
            />
          </div>

          {/* Body */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Content
            </label>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the email content here..."
              rows={9}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeEmail}
            disabled={loading || (!subject.trim() && !body.trim())}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing Email...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Analyze Email
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8">
            {result.error ? (
              <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-yellow-400" />
                  <p className="font-medium text-yellow-400">
                    Analysis Unavailable
                  </p>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {result.error}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="flex items-center gap-3">
                  {result.risk_score >= 40 ? (
                    <AlertTriangle
                      size={22}
                      className="text-yellow-400"
                    />
                  ) : (
                    <ShieldCheck
                      size={22}
                      className="text-emerald-400"
                    />
                  )}

                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                      EMAIL ANALYSIS COMPLETE
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {result.verdict}
                    </h2>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
                    <p className="text-xs text-slate-500">Risk Score</p>

                    <p
                      className={`mt-2 text-3xl font-semibold ${getRiskColor(
                        result.risk_score
                      )}`}
                    >
                      {result.risk_score}
                      <span className="ml-1 text-sm text-slate-600">
                        /100
                      </span>
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
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

                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
                    <p className="text-xs text-slate-500">Risk Level</p>

                    <p className="mt-2 text-xl font-semibold text-white">
                      {result.risk_level}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Based on detected email characteristics.
                    </p>
                  </div>
                </div>

                {/* Reasons */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-300">
                    Detection Reasons
                  </p>

                  <div className="mt-3 space-y-2">
                    {result.reasons.map((reason, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-4"
                      >
                        <AlertTriangle
                          size={17}
                          className="mt-0.5 shrink-0 text-yellow-400"
                        />

                        <p className="text-sm leading-6 text-slate-400">
                          {reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailAnalyzer;