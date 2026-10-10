\# ThreatLens AI

\### See the Threat Before You Trust It.



\*\*ThreatLens AI\*\* is an AI-powered cyber safety platform designed to help users identify potentially suspicious URLs, phishing emails, scam messages, and risky links.



\## Why This Project?



Online users regularly encounter phishing websites, fraudulent messages, suspicious links, and websites with missing security protections. ThreatLens AI brings several basic cyber-safety checks together in one platform and explains why an item may require attention.



\## Key Features



\- \*\*URL Threat Scanner:\*\* Uses a trained machine-learning model to estimate phishing risk and display a risk score with reasons.

\- \*\*Website Security Analyzer:\*\* Checks HTTPS usage, redirects, HTTP response status, server information, and selected security headers.

\- \*\*Email Phishing Analyzer:\*\* Examines email subject and body for suspicious keywords, urgency, links, and credential-related language.

\- \*\*Scam Message Analyzer:\*\* Looks for common scam indicators, including prize claims, requests for money, urgency, and sensitive information.

\- \*\*Link Safety Analyzer:\*\* Evaluates URL characteristics such as HTTPS usage, IP-address hosts, suspicious keywords, and unusual URL structures.

\- \*\*Dashboard:\*\* Displays scan statistics and recent scan activity.

\- \*\*Scan History:\*\* Stores and retrieves scan records using MongoDB Atlas.



\## Technology Stack



\*\*Frontend:\*\* React, Vite, Tailwind CSS, React Router, Lucide React  

\*\*Backend:\*\* Python, FastAPI  

\*\*Machine Learning:\*\* pandas, scikit-learn, Joblib, Random Forest  

\*\*Database:\*\* MongoDB Atlas with PyMongo  

\*\*Additional Libraries:\*\* Requests, python-dotenv



\## Project Architecture



React frontend → FastAPI backend → URL and content analyzers → Risk assessment → Results and explanations → MongoDB scan history.



\## Project Structure



\- `backend/` — API endpoints, security analyzers, database connection, and scan history.

\- `frontend-app/` — React user interface and application pages.

\- `ml/datasets/` — Phishing detection dataset.

\- `ml/models/` — Saved machine-learning model and feature information.

\- `ml/train\_model.py` — Model training script.



\## Current Status



The frontend and backend have been developed, the machine-learning model has been trained, and MongoDB Atlas integration has been tested. The URL scanner, website analyzer, email analyzer, scam analyzer, link analyzer, dashboard, and scan history are implemented.



Additional work on testing, security hardening, deployment, and planned features will continue as development progresses.



\## Important Note



ThreatLens AI is a cybersecurity learning and detection-support project. Its scores and findings are indicators, not guarantees that a website or message is safe or malicious. Users should verify suspicious activity independently and avoid sharing passwords, OTPs, or confidential information with untrusted sources.



\## Author



\*\*Isneha Varshney\*\*  

GitHub: \[SnehavarshneyDev](https://github.com/SnehavarshneyDev)



\---



\*ThreatLens AI — See the Threat Before You Trust It.\*

