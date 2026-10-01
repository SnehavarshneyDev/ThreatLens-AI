import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "threatlens_ai")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured in .env")

client = MongoClient(MONGODB_URI)

db = client[MONGODB_DB]

scan_history_collection = db["scan_history"]