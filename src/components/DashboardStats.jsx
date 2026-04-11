import React, { useState, useEffect } from 'react';
import styles from './DashboardStats.module.css';

const DashboardStats = () => {
  const [scanned, setScanned] = useState(45678);

  // Simulate live updating network stats
  useEffect(() => {
    const tick = setInterval(() => {
      setScanned(prev => prev + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>Risk Level</div>
        <div className={`${styles.statValue} ${styles.highlight}`}>
          Medium
        </div>
      </div>
      
      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>Live AI Agent Logs</div>
        <div className={styles.statValue}>103 <span className={styles.statUnit}>Agents Active</span></div>
      </div>

      <div className={`glass-panel ${styles.statBox}`}>
        <div className={styles.statLabel}>Transactions Scanned</div>
        <div className={`${styles.statValue} ${styles.counter}`}>
          {scanned.toLocaleString()}
          <span className={styles.statUnit} style={{color: '#10b981', marginLeft: '12px', fontSize: '0.9rem'}}>+15% Today</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
