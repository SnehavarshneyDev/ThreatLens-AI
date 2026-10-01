import re
from urllib.parse import urlparse

from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl


router = APIRouter(
    prefix="/api/link",
    tags=["Link Safety Analyzer"],
)


class LinkAnalyzeRequest(BaseModel):
    url: HttpUrl


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
    "claim",
    "reward",
    "prize",
]


def analyze_link(url: str):
    parsed = urlparse(url)

    risk_score = 0
    reasons = []

    hostname = parsed.hostname or ""
    path = parsed.path.lower()

    # HTTPS check
    if parsed.scheme != "https":
        risk_score += 15
        reasons.append(
            "Link does not use HTTPS"
        )

    # IP address check
    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname):
        risk_score += 30
        reasons.append(
            "Link uses an IP address instead of a domain name"
        )

    # URL length
    if len(url) > 100:
        risk_score += 10
        reasons.append(
            "Link has an unusually long URL structure"
        )

    # Suspicious keywords
    matched_keywords = [
        keyword
        for keyword in SUSPICIOUS_KEYWORDS
        if keyword in url.lower()
    ]

    if matched_keywords:
        risk_score += min(
            len(matched_keywords) * 5,
            25,
        )

        reasons.append(
            "Suspicious keywords detected: "
            + ", ".join(matched_keywords[:5])
        )

    # Multiple subdomains
    subdomain_count = max(
        len(hostname.split(".")) - 2,
        0,
    )

    if subdomain_count >= 2:
        risk_score += 10
        reasons.append(
            "Link contains multiple subdomains"
        )

    # @ symbol
    if "@" in url:
        risk_score += 15
        reasons.append(
            "Link contains an unusual @ symbol"
        )

    # Hyphen-heavy domain
    if hostname.count("-") >= 2:
        risk_score += 10
        reasons.append(
            "Domain contains multiple hyphens"
        )

    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        risk_level = "High Risk"
        verdict = "Likely Unsafe"
    elif risk_score >= 40:
        risk_level = "Medium Risk"
        verdict = "Needs Review"
    else:
        risk_level = "Low Risk"
        verdict = "Likely Safe"

    if not reasons:
        reasons.append(
            "No obvious suspicious link characteristics detected"
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "reasons": reasons,
    }


@router.post("/analyze")
def analyze_link_endpoint(request: LinkAnalyzeRequest):
    result = analyze_link(str(request.url))

    return {
        "url": str(request.url),
        **result,
    }