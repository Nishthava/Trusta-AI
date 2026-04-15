def calculate_risk(txn: dict):
    score = 0
    reasons = []

    if txn["amount"] > 10000:
        score += 20
        reasons.append({"message": "High amount", "type": "danger"})

    if txn["is_new_receiver"]:
        score += 30
        reasons.append({"message": "High amount", "type": "danger"})

    txn_count = txn.get("txn_count", 0)

    if txn_count > 10:
     score += 20
     reasons.append({"message": "High incoming transaction count", "type": "warning"})

    if txn_count > 20:
     score += 30
    reasons.append({"message": "High incoming transaction count", "type": "warning"})

    # Additional heuristics
    if txn["amount"] > 50000:
        score += 20
        reasons.append({"message": "High incoming transaction count", "type": "warning"})

    if txn["sender_id"] == txn["receiver_id"]:
        score += 10
        reasons.append({"message": "High incoming transaction count", "type": "warning"})

    return score, reasons