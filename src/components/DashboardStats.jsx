import React, { useState, useEffect } from 'react';
import styles from './DashboardStats.module.css';

const DashboardStats = () => {
  const [scanned, setScanned] = useState(1450239);
  const [blockedVal, setBlockedVal] = useState(24.5);

  // Simulate live updating network stats
  useEffect(() => {
    const tick = setInterval(() => {
      setScanned(prev => prev + Math.floor(Math.random() * 5));
      if (Math.random() > 0.8) {
        setBlockedVal(prev => prev + 0.1);
      }
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>SYSTEM STATUS</div>
        <div className={`${styles.statValue} ${styles.statusActive}`}>
          <div className={styles.pulseDot}></div> SECURE
        </div>
      </div>
      
      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>NETWORK NODES</div>
        <div className={styles.statValue}>1,402 <span className={styles.statUnit}>ACTIVE</span></div>
      </div>

      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>TRANSACTIONS SECURED</div>
        <div className={`${styles.statValue} ${styles.counter}`}>{scanned.toLocaleString()}</div>
      </div>

      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>THREATS BLOCKED (TODAY)</div>
        <div className={`${styles.statValue} ${styles.highlight}`}>
          ₹{blockedVal.toFixed(1)}<span className={styles.statUnit}>M</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
