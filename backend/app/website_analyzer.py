import requests

from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl


router = APIRouter(
    prefix="/api/website",
    tags=["Website Security Analyzer"],
)


class WebsiteAnalyzeRequest(BaseModel):
    url: HttpUrl


@router.post("/analyze")
def analyze_website(request: WebsiteAnalyzeRequest):
    url = str(request.url)

    try:
        response = requests.get(
            url,
            timeout=10,
            allow_redirects=True,
            headers={
                "User-Agent": "ThreatLens-AI-Security-Scanner/1.0"
            },
        )

        headers = response.headers

        security_headers = {
            "Content-Security-Policy": "Content-Security-Policy"
            in headers,
            "Strict-Transport-Security": "Strict-Transport-Security"
            in headers,
            "X-Content-Type-Options": "X-Content-Type-Options"
            in headers,
            "X-Frame-Options": "X-Frame-Options"
            in headers,
        }

        return {
            "url": url,
            "status_code": response.status_code,
            "final_url": response.url,
            "https": response.url.startswith("https://"),
            "redirected": response.url != url,
            "security_headers": security_headers,
            "server": headers.get("Server"),
        }

    except requests.RequestException as exc:
        return {
            "url": url,
            "error": str(exc),
        }