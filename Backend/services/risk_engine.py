def calculate_risk(txn: dict):
    score = 0
    reasons = []

    if txn["amount"] > 10000:
        score += 20
        reasons.append("High amount")

    if txn["is_new_receiver"]:
        score += 30
        reasons.append("Unknown receiver")

    if 0 <= txn["time"] <= 5:
        score += 10
        reasons.append("Odd hour transaction")

    # Additional heuristics
    if txn["amount"] > 50000:
        score += 20
        reasons.append("Extremely high amount")

    if txn["sender_id"] == txn["receiver_id"]:
        score += 10
        reasons.append("Sender and receiver are the same")

    return score, reasons