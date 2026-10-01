import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  History as HistoryIcon,
  ShieldCheck,
  AlertTriangle,
  Search,
  RefreshCw,
} from "lucide-react";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/history/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load scan history. Make sure the FastAPI server is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return history;
    }

    return history.filter((item) =>
      item.url.toLowerCase().includes(query)
    );
  }, [history, search]);

  const getStatusColor = (riskLevel) => {
    if (riskLevel === "High Risk") {
      return "text-red-400";
    }

    if (riskLevel === "Medium Risk") {
      return "text-amber-400";
    }

    return "text-emerald-400";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    return new Date(dateString).toLocaleString();
  };

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
              Scan History
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-400">
            ACTIVITY
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Scan History
          </h2>

          <p className="mt-2 text-slate-400">
            Review websites and security scans analyzed through
            ThreatLens AI.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scanned URLs..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
            />
          </div>

          <button
            onClick={fetchHistory}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-6 border-b border-white/10 px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            <span>Website</span>
            <span>Status</span>
            <span>Score</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <RefreshCw
                size={25}
                className="animate-spin text-cyan-400"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading scan history...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <AlertTriangle
                size={28}
                className="text-red-400"
              />

              <h3 className="mt-4 text-lg font-semibold">
                Unable to load history
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                onClick={fetchHistory}
                className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Try Again
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <HistoryIcon
                  size={25}
                  className="text-slate-500"
                />
              </div>

              <h3 className="text-lg font-semibold">
                {search
                  ? "No matching scans"
                  : "No scan history yet"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "Try searching with a different URL."
                  : "Once you analyze a URL, its security result and threat score will appear here."}
              </p>

              {!search && (
                <button
                  onClick={() =>
                    (window.location.href = "/scanner")
                  }
                  className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Search size={17} />
                  Start Your First Scan
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-6 px-6 py-5 transition hover:bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {item.url}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {formatDate(item.scanned_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.risk_level === "High Risk" ? (
                      <AlertTriangle
                        size={16}
                        className="text-red-400"
                      />
                    ) : (
                      <ShieldCheck
                        size={16}
                        className={
                          item.risk_level === "Medium Risk"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      />
                    )}

                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        item.risk_level
                      )}`}
                    >
                      {item.verdict}
                    </span>
                  </div>

                  <div
                    className={`text-sm font-semibold ${getStatusColor(
                      item.risk_level
                    )}`}
                  >
                    {item.risk_score}/100
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <StatusInfo
            icon={<ShieldCheck size={19} />}
            title="Safe"
            text="Websites classified as low-risk will appear with a safe status."
          />

          <StatusInfo
            icon={<AlertTriangle size={19} />}
            title="Threat Detected"
            text="Suspicious or malicious results will be highlighted for review."
          />
        </div>
      </main>
    </div>
  );
}

function StatusInfo({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 text-cyan-400">
        {icon}
      </div>

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

export default History;