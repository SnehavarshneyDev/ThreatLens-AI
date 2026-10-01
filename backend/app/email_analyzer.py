import re

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/email",
    tags=["Email Phishing Analyzer"],
)


class EmailAnalyzeRequest(BaseModel):
    subject: str
    body: str


PHISHING_KEYWORDS = [
    "urgent",
    "verify",
    "verification",
    "account suspended",
    "account locked",
    "password",
    "confirm",
    "login",
    "signin",
    "security alert",
    "click here",
    "immediately",
    "update your account",
    "reset your password",
    "bank",
    "payment",
    "refund",
    "otp",
]


def analyze_email_content(subject: str, body: str):
    text = f"{subject} {body}".lower()

    risk_score = 0
    reasons = []

    matched_keywords = [
        keyword
        for keyword in PHISHING_KEYWORDS
        if keyword in text
    ]

    if matched_keywords:
        points = min(len(matched_keywords) * 8, 40)
        risk_score += points

        reasons.append(
            f"Suspicious language detected: "
            f"{', '.join(matched_keywords[:5])}"
        )

    url_matches = re.findall(
        r"https?://[^\s]+",
        text
    )

    if url_matches:
        risk_score += min(len(url_matches) * 15, 30)

        reasons.append(
            "Email contains one or more clickable URLs"
        )

    if "http://" in text:
        risk_score += 10

        reasons.append(
            "Email contains a non-secure HTTP link"
        )

    urgency_words = [
        "urgent",
        "immediately",
        "as soon as possible",
        "within 24 hours",
        "act now",
    ]

    if any(word in text for word in urgency_words):
        risk_score += 10

        reasons.append(
            "Email uses urgency or pressure tactics"
        )

    if (
        "password" in text
        or "otp" in text
        or "verification code" in text
    ):
        risk_score += 10

        reasons.append(
            "Email requests or references sensitive credentials"
        )

    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        risk_level = "High Risk"
        verdict = "Likely Phishing"
    elif risk_score >= 40:
        risk_level = "Medium Risk"
        verdict = "Suspicious"
    else:
        risk_level = "Low Risk"
        verdict = "Likely Safe"

    if not reasons:
        reasons.append(
            "No obvious phishing indicators detected"
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "reasons": reasons,
    }


@router.post("/analyze")
def analyze_email(request: EmailAnalyzeRequest):
    result = analyze_email_content(
        request.subject,
        request.body,
    )

    return {
        "subject": request.subject,
        **result,
    }