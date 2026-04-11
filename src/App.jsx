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

  const handleTransactionSubmit = async (formData) => {
    // Reset state
    setLogs([]);
    setDecisionData(null);
    setIsProcessing(true);

    // Phase 1: Observe
    addLog(`INITIALIZING AGENT TRIDENT...`, 'info');
    await delay(600);
    addLog(`Intercepted transaction request from ${formData.senderUPI} to ${formData.receiverUPI}.`, 'info');
    await delay(1000);
    
    // Phase 2: Think / Analyze
    addLog(`Analyzing transaction parameters...`, 'info');
    await delay(800);

    const result = calculateRisk(formData);

    // Simulate stepping through rules
    for (const logic of result.reasoning) {
      addLog(`Evaluating parameter: ${logic.message}`, logic.type === 'danger' ? 'danger' : 'info');
      await delay(900);
    }

    addLog(`Computation complete. Risk index generated.`, 'success');
    await delay(500);

    // Phase 3: Decide & Act
    setDecisionData({
      riskScore: result.riskScore,
      decision: result.decision,
      reasoning: result.reasoning
    });
    setIsProcessing(false);
  };

  return (
    <div className={styles.appWrapper}>
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <div className={styles.fluidIcon}></div>
          <h1>Trusta<span>Guard</span></h1>
        </div>
        <div className={styles.subtitle}>Fluid AI Fraud Prevention</div>
      </header>

      <main className={styles.bentoGrid}>
        <div className={styles.bentoHeader}>
          <DashboardStats />
        </div>

        <div className={styles.bentoLeft}>
          <TransactionForm onSubmit={handleTransactionSubmit} disabled={isProcessing} />
        </div>
        
        <div className={styles.bentoRight}>
          <div className={styles.bentoLogs}>
            <AgentLogs logs={logs} isThinking={isProcessing} />
          </div>
          
          <div className={styles.bentoDecision}>
            {decisionData && <RiskAnalysis decisionData={decisionData} />}
            {!decisionData && !isProcessing && (
              <div className={`glass-panel ${styles.waitingState}`}>
                <div className={styles.auroraEffect}></div>
                <div className={styles.waitingContent}>
                  <div className={styles.ripplePulse}></div>
                  <span>System ready. Awaiting transaction data...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
