from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.risk_engine import calculate_risk
from db import get_db_connection

router = APIRouter()

class Transaction(BaseModel):
    txn_id: str
    sender_id: str
    receiver_id: str
    amount: float
    device_id: str
    is_new_receiver: bool
    time: int  # hour of day (0-23)

@router.post("/analyze")
def analyze_transaction(txn: Transaction):
    txn_dict = txn.dict()
    score, reasons = calculate_risk(txn_dict)

    if score > 70:
        status = "BLOCK"
    elif score > 30:
        status = "WARN"
    else:
        status = "ALLOW"

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO transactions (txn_id, sender_id, receiver_id, amount, txn_time, device_id, status) VALUES (%s,%s,%s,%s,NOW(),%s,%s)",
            (txn.txn_id, txn.sender_id, txn.receiver_id, txn.amount, txn.device_id, status)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        # Don't fail the whole request if DB write fails
        print(f"[DB Error] {e}")

    return {
        "risk_score": score,
        "status": status,
        "reasons": reasons
    }