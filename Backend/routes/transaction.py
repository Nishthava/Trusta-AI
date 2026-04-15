from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.risk_engine import calculate_risk
from db import get_db_connection
def get_user_id_from_upi(upi_id, conn):
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM users WHERE upi_id=%s", (upi_id,))
    result = cursor.fetchone()
    return result[0] if result else None

router = APIRouter()

class Transaction(BaseModel):
    txn_id: str
    receiver_upi: str
    amount: float
def get_receiver_txn_count(receiver_id, conn):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT COUNT(*) FROM transactions WHERE receiver_id = %s",
        (receiver_id,)
    )
    return cursor.fetchone()[0]

@router.post("/analyze")
def analyze_transaction(txn: Transaction):
    txn_dict = txn.dict()
    conn = get_db_connection()
    cursor = conn.cursor()

    # fixed sender
    sender_id = "U1"

    # convert UPI to user_id
    receiver_id = get_user_id_from_upi(txn.receiver_upi, conn)

    if receiver_id:
     txn_count = get_receiver_txn_count(receiver_id, conn)
    else:
     txn_count = 0

    txn_dict["txn_count"] = txn_count
    is_unknown = receiver_id is None

    if is_unknown:
     receiver_id = "UNKNOWN"
    txn_dict["receiver_id"] = receiver_id
    txn_dict["sender_id"] = sender_id

    # check new receiver
    cursor.execute(
        "SELECT COUNT(*) FROM transactions WHERE sender_id=%s AND receiver_id=%s",
        (sender_id, receiver_id)
    )
    count = cursor.fetchone()[0]

    new_receiver = (count == 0) or is_unknown

    # simulate device
    device_id = "D1"

    cursor.execute(
        "SELECT COUNT(*) FROM devices WHERE user_id=%s AND device_id=%s",
        (sender_id, device_id)
    )
    device_count = cursor.fetchone()[0]

    new_device = (device_count == 0)

    # simulate location
    current_location = "Pune"

    cursor.execute(
        "SELECT last_location FROM users WHERE user_id=%s",
        (sender_id,)
    )
    last_location = cursor.fetchone()[0]

    location_changed = (last_location != current_location)

    # prepare data
    txn_dict["is_new_receiver"] = new_receiver
    txn_dict["is_new_device"] = new_device
    txn_dict["location_changed"] = location_changed

    score, reasons = calculate_risk(txn_dict)

    if score > 70:
        status = "BLOCK"
    elif score > 30:
        status = "WARN"
    else:
        status = "ALLOW"

    # insert into DB
    try:
        cursor.execute(
            "INSERT INTO transactions (txn_id, sender_id, receiver_id, amount, txn_time, device_id, location, status) VALUES (%s,%s,%s,%s,NOW(),%s,%s,%s)",
            (txn.txn_id, sender_id, receiver_id, txn.amount, device_id, current_location, status)
        )
        conn.commit()
    except Exception as e:
        print(f"[DB Error] {e}")

    conn.close()
    print("FINAL TXN:", txn_dict)

    return {
        "risk_score": score,
        "status": status,
        "reasons": reasons,
        "auto_flags": {
            "new_receiver": new_receiver,
            "new_device": new_device,
            "location_changed": location_changed
        }
    }


   