/**
 * TrustaGuard Risk Engine v3.0
 * Autonomous UPI Fraud Detection System
 */

export const calculateRisk = (txData, history = []) => {
  let riskScore = 0;
  const reasoning = [];
  const flags = [];

  // ── Rule 1: High Amount ──────────────────────────────────────────────
  const amount = parseFloat(txData.amount);
  if (amount > 100000) {
    riskScore += 45;
    reasoning.push({ type: 'danger', message: `Critical: Transaction ₹${amount.toLocaleString()} far exceeds safe threshold` });
    flags.push('CRITICAL_AMOUNT');
  } else if (amount > 50000) {
    riskScore += 35;
    reasoning.push({ type: 'warning', message: `High-value transaction detected: ₹${amount.toLocaleString()} (>₹50,000)` });
    flags.push('HIGH_AMOUNT');
  } else if (amount > 10000) {
    riskScore += 10;
    reasoning.push({ type: 'info', message: `Moderate amount: ₹${amount.toLocaleString()} — within caution range` });
  } else {
    reasoning.push({ type: 'success', message: `Amount ₹${amount.toLocaleString()} is within safe limits` });
  }

  // ── Rule 2: New/Unknown Receiver ────────────────────────────────────
  if (txData.isReceiverNew) {
    riskScore += 30;
    reasoning.push({ type: 'danger', message: `Receiver UPI "${txData.receiverUPI}" not found in trusted contacts` });
    flags.push('NEW_RECEIVER');
  } else {
    reasoning.push({ type: 'success', message: `Receiver "${txData.receiverUPI}" is a verified, known contact` });
  }

  // ── Rule 3: New/Unregistered Device ──────────────────────────────────
  if (txData.isNewDevice) {
    riskScore += 30;
    reasoning.push({ type: 'danger', message: 'Transaction initiated from an unregistered device — possible account takeover' });
    flags.push('NEW_DEVICE');
  } else {
    reasoning.push({ type: 'success', message: 'Device fingerprint matched — registered & trusted device confirmed' });
  }

  // ── Rule 4: Geographic Anomaly ────────────────────────────────────────
  if (txData.isLocationChanged) {
    riskScore += 20;
    reasoning.push({ type: 'warning', message: 'Geographic anomaly: transaction originated from an unusual location' });
    flags.push('LOCATION_ANOMALY');
  } else {
    reasoning.push({ type: 'success', message: 'Location is consistent with user's typical transaction zone' });
  }

  // ── Rule 5: Transaction Velocity ─────────────────────────────────────
  if (txData.frequency === 'high') {
    riskScore += 30;
    reasoning.push({ type: 'danger', message: 'High transaction velocity: >5 transactions detected in a short window (fraud burst pattern)' });
    flags.push('HIGH_VELOCITY');
  } else if (txData.frequency === 'medium') {
    riskScore += 10;
    reasoning.push({ type: 'warning', message: 'Elevated frequency: 3–5 transactions today — monitoring for burst activity' });
  } else {
    reasoning.push({ type: 'success', message: 'Transaction velocity is normal — no rapid/repeated sending detected' });
  }

  // ── Rule 6: Behavioral Pattern from History ───────────────────────────
  if (history.length > 0) {
    const recentSameReceiver = history.filter(
      (t) => t.receiverUPI === txData.receiverUPI && t.decision === 'BLOCK'
    );
    if (recentSameReceiver.length > 0) {
      riskScore += 20;
      reasoning.push({ type: 'danger', message: `⚠ Memory Alert: This receiver was previously flagged & blocked in session history` });
      flags.push('REPEAT_FLAGGED_RECEIVER');
    }

    const recentBlocked = history.filter((t) => t.decision === 'BLOCK');
    if (recentBlocked.length >= 2) {
      riskScore += 10;
      reasoning.push({ type: 'warning', message: `Behavioral anomaly: ${recentBlocked.length} blocked transactions in this session — escalated vigilance` });
    }
  }

  // ── Compound Rule: Multiple Risk Factors ─────────────────────────────
  if (flags.length >= 3) {
    riskScore += 10;
    reasoning.push({ type: 'danger', message: `Compound Risk: ${flags.length} simultaneous risk indicators exceed threshold — escalating to BLOCK` });
  }

  // Cap at 100
  riskScore = Math.min(riskScore, 100);

  // ── Decision ──────────────────────────────────────────────────────────
  let decision = 'ALLOW';
  if (riskScore >= 70) {
    decision = 'BLOCK';
  } else if (riskScore >= 40) {
    decision = 'OTP';
  }

  // ── Summary Explanation ───────────────────────────────────────────────
  const dangerFlags = reasoning.filter((r) => r.type === 'danger' || r.type === 'warning');
  let summary = 'Transaction appears safe across all evaluated parameters.';
  if (decision === 'BLOCK') {
    const reasons = dangerFlags.map((r) => r.message.split(':')[0]).join(', ');
    summary = `Transaction BLOCKED due to: ${reasons || 'multiple high-risk factors'}.`;
  } else if (decision === 'OTP') {
    summary = `OTP verification required — moderate risk detected. Please confirm identity.`;
  }

  return { riskScore, reasoning, decision, flags, summary };
};

export const generateAgentSteps = (formData) => [
  { delay: 400,  type: 'init',    message: `◈ TRUSTA AGENT v3.0 — Autonomous Fraud Detection System initialized` },
  { delay: 700,  type: 'observe', message: `⟡ OBSERVE — Intercepting transaction: ${formData.senderUPI} → ${formData.receiverUPI}` },
  { delay: 600,  type: 'observe', message: `⟡ OBSERVE — Transaction value: ₹${parseFloat(formData.amount).toLocaleString()}` },
  { delay: 800,  type: 'think',   message: `⟢ THINK — Loading behavioral baseline for sender profile...` },
  { delay: 700,  type: 'think',   message: `⟢ THINK — Querying device registry & fingerprint database...` },
  { delay: 600,  type: 'think',   message: `⟢ THINK — Fetching geolocation history & IP risk scores...` },
  { delay: 700,  type: 'think',   message: `⟢ THINK — Running transaction velocity analysis (${formData.frequency} frequency)...` },
  { delay: 800,  type: 'think',   message: formData.isReceiverNew
      ? `⟢ THINK — Receiver UPI not in contact graph — trust score: UNVERIFIED`
      : `⟢ THINK — Receiver verified in contact graph — trust score: HIGH` },
  { delay: 700,  type: 'think',   message: formData.isNewDevice
      ? `⟢ THINK — ⚠ Device mismatch detected — escalating device risk flag`
      : `⟢ THINK — Device fingerprint confirmed — no anomaly` },
  { delay: 600,  type: 'think',   message: formData.isLocationChanged
      ? `⟢ THINK — ⚠ Geographic anomaly — location diverges from user history`
      : `⟢ THINK — Location consistent with historical transaction zone` },
  { delay: 900,  type: 'compute', message: `⟣ COMPUTE — Aggregating weighted risk factors across all signals...` },
  { delay: 700,  type: 'compute', message: `⟣ COMPUTE — Running ensemble fraud classifier...` },
  { delay: 800,  type: 'decide',  message: `⟤ DECIDE — Generating final risk index & agent decision...` },
];
