import {
  ArrowLeft,
  TrendingUp,
  Shield,
  AlertTriangle,
  Activity,
} from "lucide-react";

function Insights() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#080b12]/80">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-5">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-xl font-semibold">
              ThreatLens <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-sm text-slate-500">
              Security Insights
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-400">
            SECURITY INTELLIGENCE
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Security Insights
          </h2>

          <p className="mt-2 max-w-2xl text-slate-400">
            Understand your scanning activity and security trends through
            ThreatLens AI.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          <InsightCard
            icon={<TrendingUp size={21} />}
            title="Threat Trend"
            value="—"
            description="Not enough scan data"
          />

          <InsightCard
            icon={<Shield size={21} />}
            title="Protection Level"
            value="—"
            description="Calculated from activity"
          />

          <InsightCard
            icon={<Activity size={21} />}
            title="Scan Activity"
            value="0"
            description="Total analyses"
          />
        </div>

        {/* Threat Overview */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Threat Overview</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your detected threat activity will appear here.
              </p>
            </div>

            <AlertTriangle size={21} className="text-slate-600" />
          </div>

          <div className="mt-8 flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10">
            <div className="text-center">
              <Activity
                size={28}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="text-sm text-slate-500">
                Analytics will appear after your first scans.
              </p>
            </div>
          </div>
        </section>

        {/* Security Recommendations */}
        <section className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">
            Security Recommendations
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <Recommendation
              number="01"
              title="Verify unfamiliar links"
              text="Analyze suspicious URLs before opening or sharing them."
            />

            <Recommendation
              number="02"
              title="Review scan results"
              text="Check the reasons behind a threat score instead of relying only on a label."
            />

            <Recommendation
              number="03"
              title="Stay security aware"
              text="Learn common phishing and online scam patterns through the awareness hub."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function InsightCard({ icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-400">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{title}</p>

      <div className="mt-2 text-3xl font-semibold">{value}</div>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Recommendation({ number, title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <span className="text-xs font-medium text-cyan-400">
        {number}
      </span>

      <h4 className="mt-3 text-sm font-semibold">{title}</h4>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

export default Insights;