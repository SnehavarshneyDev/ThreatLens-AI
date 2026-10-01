from urllib.parse import urlparse
import os
import re

import joblib
import pandas as pd

from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl


router = APIRouter(prefix="/api", tags=["Threat Scanner"])


class ScanRequest(BaseModel):
    url: HttpUrl


class ScanResponse(BaseModel):
    url: str
    risk_score: int
    risk_level: str
    verdict: str
    reasons: list[str]


# -----------------------------------
# Load trained ML model
# -----------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "..",
    "ml",
    "models",
    "phishing_model.pkl",
)

FEATURE_PATH = os.path.join(
    BASE_DIR,
    "..",
    "..",
    "ml",
    "models",
    "feature_names.pkl",
)

model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURE_PATH)


# -----------------------------------
# URL Feature Extraction
# -----------------------------------

SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "password",
    "signin",
    "bank",
    "wallet",
    "confirm",
]


def extract_features(url: str):
    parsed = urlparse(url)

    hostname = parsed.hostname or ""
    full_url = url.lower()

    features = {}

    # UsingIP
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", hostname):
        features["UsingIP"] = 1
    else:
        features["UsingIP"] = -1

    # LongURL
    if len(url) >= 75:
        features["LongURL"] = 1
    else:
        features["LongURL"] = -1

    # ShortURL
    shorteners = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "is.gd",
        "ow.ly",
        "buff.ly",
    ]

    if any(domain in hostname for domain in shorteners):
        features["ShortURL"] = 1
    else:
        features["ShortURL"] = -1

    # Symbol@
    features["Symbol@"] = 1 if "@" in url else -1

    # Redirecting//
    path = parsed.path

    if "//" in path:
        features["Redirecting//"] = 1
    else:
        features["Redirecting//"] = -1

    # PrefixSuffix-
    features["PrefixSuffix-"] = (
        1 if "-" in hostname else -1
    )

    # SubDomains
    dot_count = hostname.count(".")

    if dot_count >= 3:
        features["SubDomains"] = 1
    elif dot_count == 2:
        features["SubDomains"] = 0
    else:
        features["SubDomains"] = -1

    # HTTPS
    features["HTTPS"] = (
        1 if parsed.scheme == "https" else -1
    )

    # DomainRegLen
    # Not available from URL alone.
    features["DomainRegLen"] = 0

    # Favicon
    features["Favicon"] = 0

    # NonStdPort
    port = parsed.port

    if port and port not in [80, 443]:
        features["NonStdPort"] = 1
    else:
        features["NonStdPort"] = -1

    # HTTPSDomainURL
    features["HTTPSDomainURL"] = (
        1
        if "https" in hostname
        else -1
    )

    # RequestURL
    features["RequestURL"] = 0

    # AnchorURL
    features["AnchorURL"] = 0

    # LinksInScriptTags
    features["LinksInScriptTags"] = 0

    # ServerFormHandler
    features["ServerFormHandler"] = 0

    # InfoEmail
    features["InfoEmail"] = (
        1
        if "mailto:" in full_url
        else -1
    )

    # AbnormalURL
    features["AbnormalURL"] = (
        1
        if hostname and hostname not in full_url
        else -1
    )

    # WebsiteForwarding
    features["WebsiteForwarding"] = 0

    # StatusBarCust
    features["StatusBarCust"] = 0

    # DisableRightClick
    features["DisableRightClick"] = 0

    # UsingPopupWindow
    features["UsingPopupWindow"] = 0

    # IframeRedirection
    features["IframeRedirection"] = 0

    # AgeofDomain
    features["AgeofDomain"] = 0

    # DNSRecording
    features["DNSRecording"] = 0

    # WebsiteTraffic
    features["WebsiteTraffic"] = 0

    # PageRank
    features["PageRank"] = 0

    # GoogleIndex
    features["GoogleIndex"] = 0

    # LinksPointingToPage
    features["LinksPointingToPage"] = 0

    # StatsReport
    features["StatsReport"] = 0

    return features


# -----------------------------------
# Generate explainable reasons
# -----------------------------------

def generate_reasons(url: str, features: dict):
    reasons = []

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    full_url = url.lower()

    if features["UsingIP"] == 1:
        reasons.append(
            "URL uses an IP address instead of a domain name"
        )

    if features["LongURL"] == 1:
        reasons.append(
            "URL is unusually long"
        )

    if features["ShortURL"] == 1:
        reasons.append(
            "URL uses a known URL-shortening service"
        )

    if features["Symbol@"] == 1:
        reasons.append(
            "URL contains an unusual @ character"
        )

    if features["Redirecting//"] == 1:
        reasons.append(
            "URL contains a suspicious redirect pattern"
        )

    if features["PrefixSuffix-"] == 1:
        reasons.append(
            "Domain contains a hyphenated structure"
        )

    if (
    features["SubDomains"] == 1
    and features["UsingIP"] != 1
):
     reasons.append(
        "URL has a deep subdomain structure"
    )

    if features["HTTPS"] == -1:
        reasons.append(
            "Website does not use HTTPS"
        )

    found_keywords = [
        keyword
        for keyword in SUSPICIOUS_KEYWORDS
        if keyword in full_url
    ]

    if found_keywords:
        reasons.append(
            "URL contains potentially sensitive security-related keywords"
        )

    if not reasons:
        reasons.append(
            "No obvious suspicious URL characteristics detected"
        )

    return reasons


# -----------------------------------
# Scan URL
# -----------------------------------

@router.post("/scan", response_model=ScanResponse)
def scan_url(request: ScanRequest):

    url = str(request.url)

    # Extract features
    feature_dict = extract_features(url)

    # Arrange features exactly like training dataset
    feature_values = [
        feature_dict.get(feature, 0)
        for feature in feature_names
    ]

    input_data = pd.DataFrame(
        [feature_values],
        columns=feature_names,
    )

    # ML prediction
    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    phishing_probability = probabilities[1]

    # ML risk score
    risk_score = int(
        round(phishing_probability * 100)
    )

    # Risk classification
    if risk_score >= 70:
        risk_level = "High Risk"
        verdict = "Suspicious"

    elif risk_score >= 40:
        risk_level = "Medium Risk"
        verdict = "Needs Review"

    else:
        risk_level = "Low Risk"
        verdict = "Likely Safe"

    # Explainable reasons
    reasons = generate_reasons(
        url,
        feature_dict,
    )

    return ScanResponse(
        url=url,
        risk_score=risk_score,
        risk_level=risk_level,
        verdict=verdict,
        reasons=reasons,
    )