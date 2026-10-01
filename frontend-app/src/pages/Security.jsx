import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  CheckCircle2,
} from "lucide-react";

function Security() {
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
              Security Center
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-400">
            PROTECTION
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Security Center
          </h2>

          <p className="mt-2 max-w-2xl text-slate-400">
            Manage your ThreatLens security settings and understand how your
            security data is protected.
          </p>
        </div>

        {/* Security Status */}
        <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-400">
              <ShieldCheck size={24} />
            </div>

            <div>
              <p className="text-sm font-medium text-emerald-400">
                Security Status
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Your security center is active
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                ThreatLens AI is designed to help you identify suspicious
                websites and understand potential online threats.
              </p>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">
            Security Features
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <SecurityCard
              icon={<Lock size={21} />}
              title="Secure Analysis"
              description="URLs are analyzed through the ThreatLens threat-analysis pipeline before a security assessment is generated."
            />

            <SecurityCard
              icon={<KeyRound size={21} />}
              title="Protected Authentication"
              description="User authentication will use secure token-based access controls when the backend is connected."
            />

            <SecurityCard
              icon={<Eye size={21} />}
              title="Explainable Results"
              description="Threat results will provide understandable reasons instead of showing only a simple safe or unsafe label."
            />

            <SecurityCard
              icon={<ShieldCheck size={21} />}
              title="Security Monitoring"
              description="Your security activity can be monitored through scan history, insights and threat reports."
            />
          </div>
        </section>

        {/* Checklist */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="font-semibold">Security Checklist</h3>

          <div className="mt-5 space-y-4">
            <ChecklistItem text="Analyze suspicious URLs before opening them" />
            <ChecklistItem text="Review the explanation behind threat results" />
            <ChecklistItem text="Keep your account credentials secure" />
            <ChecklistItem text="Report suspicious websites when detected" />
          </div>
        </section>
      </main>
    </div>
  );
}

function SecurityCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/20">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-400">
        {icon}
      </div>

      <h4 className="font-semibold">{title}</h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ChecklistItem({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

export default Security;