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
      {/* Sidebar */}
      <aside className={`glass-panel ${styles.sidebar}`}>
        <div className={styles.logoGroup}>
          <div className={styles.fluidIcon}></div>
          <h2>TrustaGuard</h2>
        </div>
        
        <nav className={styles.navMenu}>
          <a href="#" className={styles.activeNavItem}>
            <span className={styles.navIcon}>⊞</span> Dashboard
          </a>
          <a href="#">
            <span className={styles.navIcon}>💳</span> Transactions
          </a>
          <a href="#">
            <span className={styles.navIcon}>📋</span> Live Logs
          </a>
          <a href="#">
            <span className={styles.navIcon}>📈</span> Analytics
          </a>
          <a href="#" className={styles.settingsLink}>
            <span className={styles.navIcon}>⚙️</span> Settings
          </a>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerTitle}>
            <h1>TrustaGuard AI: <span>Fraud Prevention</span> | <span className={styles.greeting}>Good Morning, Sarah J.</span></h1>
          </div>
          <div className={`glass-panel ${styles.threatBadge}`}>
            <span className={styles.threatIcon}>🔔</span> 14 Active Threats
          </div>
        </header>

        <div className={styles.bentoGrid}>
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
        </div>
      </main>
    </div>
  );
}

export default App;
