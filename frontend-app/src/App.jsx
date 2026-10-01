import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmailAnalyzer from "./pages/EmailAnalyzer";

import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Security from "./pages/Security";
import ScamAnalyzer from "./pages/ScamAnalyzer";
import LinkAnalyzer from "./pages/LinkAnalyzer";
import WebsiteAnalyzer from "./pages/WebsiteAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/history" element={<History />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/security" element={<Security />} />
        <Route path="/scam-analyzer" element={<ScamAnalyzer />} />
        <Route path="/link-analyzer" element={<LinkAnalyzer />} />
         <Route path="/email-analyzer" element={<EmailAnalyzer />} />
        <Route
  path="/website-analyzer"
  element={<WebsiteAnalyzer />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;