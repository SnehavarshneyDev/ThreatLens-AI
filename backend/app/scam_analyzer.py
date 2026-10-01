import re

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/scam",
    tags=["Scam Message Detector"],
)


class ScamAnalyzeRequest(BaseModel):
    message: str


SCAM_KEYWORDS = [
    "congratulations",
    "you won",
    "winner",
    "lottery",
    "prize",
    "claim your reward",
    "free gift",
    "selected",
    "cash prize",
    "urgent",
    "immediately",
    "act now",
    "limited time",
    "verify",
    "account suspended",
    "account blocked",
    "otp",
    "password",
    "bank",
    "upi",
    "payment",
    "refund",
    "job offer",
    "work from home",
    "registration fee",
    "processing fee",
]


def analyze_scam_message(message: str):
    text = message.lower()

    risk_score = 0
    reasons = []

    matched_keywords = [
        keyword
        for keyword in SCAM_KEYWORDS
        if keyword in text
    ]

    if matched_keywords:
        points = min(len(matched_keywords) * 6, 42)
        risk_score += points

        reasons.append(
            f"Suspicious language detected: "
            f"{', '.join(matched_keywords[:6])}"
        )

    url_matches = re.findall(
        r"https?://[^\s]+",
        text
    )

    if url_matches:
        risk_score += min(len(url_matches) * 15, 30)

        reasons.append(
            "Message contains one or more external links"
        )

    if "http://" in text:
        risk_score += 10

        reasons.append(
            "Message contains a non-secure HTTP link"
        )

    urgency_words = [
        "urgent",
        "immediately",
        "act now",
        "within 24 hours",
        "limited time",
        "as soon as possible",
    ]

    if any(word in text for word in urgency_words):
        risk_score += 10

        reasons.append(
            "Message uses urgency or pressure tactics"
        )

    sensitive_terms = [
        "otp",
        "password",
        "upi pin",
        "pin",
        "bank details",
        "card details",
        "verification code",
    ]

    if any(term in text for term in sensitive_terms):
        risk_score += 10

        reasons.append(
            "Message requests or references sensitive information"
        )

    fee_terms = [
        "registration fee",
        "processing fee",
        "pay now",
        "send money",
        "transfer money",
    ]

    if any(term in text for term in fee_terms):
        risk_score += 10

        reasons.append(
            "Message contains a possible payment or fee request"
        )

    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        risk_level = "High Risk"
        verdict = "Likely Scam"
    elif risk_score >= 40:
        risk_level = "Medium Risk"
        verdict = "Suspicious"
    else:
        risk_level = "Low Risk"
        verdict = "Likely Safe"

    if not reasons:
        reasons.append(
            "No obvious scam indicators detected"
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "reasons": reasons,
    }


@router.post("/analyze")
def analyze_scam(request: ScamAnalyzeRequest):
    result = analyze_scam_message(request.message)

    return {
        "message": request.message,
        **result,
    }