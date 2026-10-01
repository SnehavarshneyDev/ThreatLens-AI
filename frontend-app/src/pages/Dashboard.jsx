import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  ScanLine,
  Activity,
  Mail,
  MessageSquareWarning,
  Link2,
  Globe2,
} from "lucide-react";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/history/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();

      setHistory(data.history || []);
    } catch (error) {
      console.error("Dashboard history error:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalScans = history.length;

  const safeScans = history.filter(
    (item) => item.risk_level === "Low Risk"
  ).length;

  const threats = history.filter(
    (item) =>
      item.risk_level === "High Risk" ||
      item.risk_level === "Medium Risk"
  ).length;

  const securityScore =
    totalScans > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + (100 - item.risk_score),
            0
          ) / totalScans
        )
      : null;

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#080b12]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              ThreatLens <span className="text-cyan-400">AI</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Security Intelligence Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            System Secure
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-cyan-400">
            OVERVIEW
          </p>

          <h2 className="text-3xl font-semibold tracking-tight">
            Your Security Dashboard
          </h2>

          <p className="mt-2 max-w-2xl text-slate-400">
            Monitor your scans, detected threats and overall security activity
            from one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
         <StatCard
  icon={<ScanLine size={21} />}
  label="Total Scans"
  value={loading ? "..." : totalScans}
  description="URLs analyzed"
/>

<StatCard
  icon={<ShieldCheck size={21} />}
  label="Safe"
  value={loading ? "..." : safeScans}
  description="Low-risk scans"
/>

<StatCard
  icon={<AlertTriangle size={21} />}
  label="Threats"
  value={loading ? "..." : threats}
  description="Suspicious results"
/>

<StatCard
  icon={<Activity size={21} />}
  label="Security Score"
  value={
    loading
      ? "..."
      : securityScore !== null
      ? `${securityScore}/100`
      : "—"
  }
  description="Based on scan activity"
/>
        </div>

        {/* Scanner CTA */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-2 text-cyan-400">
                <ScanLine size={22} />
              </div>

              <h3 className="text-xl font-semibold">
                Scan a suspicious URL
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Analyze a website before you trust it. ThreatLens AI will
                evaluate its security signals and generate an explainable
                threat assessment.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/scanner")}
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Open Scanner
            </button>
          </div>
        </section>
        {/* Email Analyzer CTA */}
<section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-violet-400/20 bg-violet-400/5 p-2 text-violet-400">
        <Mail size={22} />
      </div>

      <h3 className="text-xl font-semibold">
        Analyze a suspicious email
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
        Check suspicious email content for phishing language,
        urgency tactics and other security indicators before you respond.
      </p>
    </div>

    <button
      onClick={() => (window.location.href = "/email-analyzer")}
      className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-6 py-3 font-semibold text-violet-300 transition hover:bg-violet-400/20"
    >
      Open Email Analyzer
    </button>
  </div>
</section>
{/* Scam Message Analyzer CTA */}
<section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-amber-400/20 bg-amber-400/5 p-2 text-amber-400">
        <MessageSquareWarning size={22} />
      </div>

      <h3 className="text-xl font-semibold">
        Analyze a suspicious message
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
        Check SMS, WhatsApp messages, job offers and online messages
        for common scam indicators before you respond.
      </p>
    </div>

    <button
      onClick={() => (window.location.href = "/scam-analyzer")}
      className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-6 py-3 font-semibold text-amber-300 transition hover:bg-amber-400/20"
    >
      Open Scam Detector
    </button>
  </div>
</section>
{/* Link Safety Analyzer CTA */}
<section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-2 text-cyan-400">
        <Link2 size={22} />
      </div>

      <h3 className="text-xl font-semibold">
        Check a suspicious link
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
        Analyze suspicious URLs for common security indicators before
        opening or sharing them.
      </p>
    </div>

    <button
      onClick={() => (window.location.href = "/link-analyzer")}
      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
    >
      Open Link Analyzer
    </button>
  </div>
</section>
{/* Website Security Analyzer CTA */}
<section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-blue-400/20 bg-blue-400/5 p-2 text-blue-400">
        <Globe2 size={22} />
      </div>

      <h3 className="text-xl font-semibold">
        Inspect website security
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
        Check HTTPS, redirects, server information and security headers
        before trusting a website.
      </p>
    </div>

    <button
      onClick={() => (window.location.href = "/website-analyzer")}
      className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-6 py-3 font-semibold text-blue-300 transition hover:bg-blue-400/20"
    >
      Open Website Analyzer
    </button>
  </div>
</section>

        {/* Recent Activity */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Activity</h3>

            <button
              onClick={() => (window.location.href = "/history")}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View History
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
  {loading ? (
    <div className="flex items-center justify-center px-6 py-14">
      <Activity size={22} className="animate-pulse text-cyan-400" />
    </div>
  ) : history.length === 0 ? (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <Activity size={21} className="text-slate-500" />
      </div>

      <h4 className="font-medium">No scans yet</h4>

      <p className="mt-2 text-sm text-slate-500">
        Your scan activity will appear here.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-white/10">
      {history.slice(0, 5).map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {item.url}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {new Date(item.scanned_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <span
              className={
                item.risk_level === "High Risk"
                  ? "text-sm font-medium text-red-400"
                  : item.risk_level === "Medium Risk"
                  ? "text-sm font-medium text-amber-400"
                  : "text-sm font-medium text-emerald-400"
              }
            >
              {item.verdict}
            </span>

            <span className="text-sm font-semibold text-slate-300">
              {item.risk_score}/100
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-400">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{label}</p>

      <div className="mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </div>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default Dashboard;