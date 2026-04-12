import React, { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import AgentLogs from './components/AgentLogs';
import RiskAnalysis from './components/RiskAnalysis';
import DashboardStats from './components/DashboardStats';
import { calculateRisk } from './utils/riskEngine';
import styles from './App.module.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionData, setDecisionData] = useState(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const API_URL = import.meta.env.VITE_API_URL;

  const handleTransactionSubmit = async (formData) => {
    setLogs([]);
    setDecisionData(null);
    setIsProcessing(true);

    addLog(`INITIALIZING AGENT TRIDENT...`, 'info');
    await delay(600);
    addLog(`Intercepted transaction request from ${formData.senderUPI} to ${formData.receiverUPI}.`, 'info');
    await delay(1000);
    addLog(`Analyzing transaction parameters...`, 'info');
    await delay(800);

    const result = calculateRisk(formData);

    for (const logic of result.reasoning) {
      addLog(`Evaluating parameter: ${logic.message}`, logic.type === 'danger' ? 'danger' : 'info');
      await delay(900);
    }

    addLog(`Computation complete. Risk index generated.`, 'success');
    await delay(500);

    // ── Send to Railway backend (save to DB) ──
    try {
      addLog(`Syncing with Trusta AI backend...`, 'info');
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txn_id: `TXN-${Date.now()}`,
          sender_id: formData.senderUPI,
          receiver_id: formData.receiverUPI,
          amount: parseFloat(formData.amount),
          device_id: formData.isNewDevice ? 'NEW_DEVICE' : 'TRUSTED_DEVICE',
          is_new_receiver: formData.isReceiverNew || false,
          time: new Date().getHours(),
        }),
      });
      if (response.ok) {
        addLog(`Backend sync successful — transaction logged.`, 'success');
      } else {
        addLog(`Backend responded with status ${response.status}.`, 'info');
      }
    } catch {
      addLog(`Backend sync skipped (offline mode).`, 'info');
    }

    setDecisionData({
      riskScore: result.riskScore,
      decision: result.decision,
      reasoning: result.reasoning,
      flags: result.flags,
    });
    setIsProcessing(false);
  };

  return (
    <div className={styles.appWrapper}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoDot}></div>
          <div className={styles.headerBrand}>
            <div className={styles.brandTitle}>
              <span>TrustaGuard AI:</span> Fraud Prevention
            </div>
            <div className={styles.brandSub}>Good Morning, Sarah J. — Session Active</div>
          </div>
        </div>
        <div className={styles.threatBadge}>
          <span>🔔</span> 14 Active Threats
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <DashboardStats />

      {/* ── Main Grid ── */}
      <main className={styles.mainGrid}>

        {/* Left: Transaction Form — untouched */}
        <div className={styles.leftPanel}>
          <TransactionForm onSubmit={handleTransactionSubmit} disabled={isProcessing} />
        </div>

        {/* Right: Agent Logs + Decision */}
        <div className={styles.rightCol}>
          <AgentLogs logs={logs} isThinking={isProcessing} />

          {decisionData ? (
            <RiskAnalysis decisionData={decisionData} />
          ) : (
            <div className={styles.waitingCard}>
              <div className={styles.waitingRing}></div>
              <span className={styles.waitingText}>System ready — awaiting transfer initiation...</span>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
