from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from app.database import scan_history_collection


router = APIRouter(prefix="/api/history", tags=["Scan History"])


class HistoryItem(BaseModel):
    url: str
    verdict: str
    risk_score: int
    risk_level: str


@router.post("/add")
def add_history(item: HistoryItem):
    record = {
        "url": item.url,
        "verdict": item.verdict,
        "risk_score": item.risk_score,
        "risk_level": item.risk_level,
        "scanned_at": datetime.now().isoformat(),
    }

    result = scan_history_collection.insert_one(record)

    record["id"] = str(result.inserted_id)

    return {
        "message": "Scan added to history",
        "record": record,
    }


@router.get("/")
def get_history():
    documents = list(
        scan_history_collection
        .find()
        .sort("scanned_at", -1)
        .limit(100)
    )

    history = []

    for document in documents:
        history.append({
            "id": str(document["_id"]),
            "url": document["url"],
            "verdict": document["verdict"],
            "risk_score": document["risk_score"],
            "risk_level": document["risk_level"],
            "scanned_at": document["scanned_at"],
        })

    return {
        "total": len(history),
        "history": history,
    }