import React, { useState, useEffect } from 'react';
import styles from './DashboardStats.module.css';

const SPARK_AGENTS = [8,14,10,18,12,22,16,24,20,28,18,26,22,28,24];
const SPARK_TX     = [10,16,12,20,14,18,22,16,26,20,24,28,22,26,28];

const DashboardStats = () => {
  const [txCount, setTxCount] = useState(45678);

  useEffect(() => {
    const tick = setInterval(() => {
      setTxCount(prev => prev + Math.floor(Math.random() * 4));
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className={styles.statBar}>

      {/* Risk Level */}
      <div className={styles.statCard}>
        <div className={styles.donutWrap}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,145,0,0.15)" strokeWidth="7" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="#ff9100" strokeWidth="7"
              strokeLinecap="round" strokeDasharray="188" strokeDashoffset="109" />
          </svg>
          <div className={styles.donutLabel}>
            <span className={styles.donutVal}>42</span>
            <span className={styles.donutMax}>/100</span>
          </div>
        </div>
        <div className={styles.statInfo}>
          <div className={styles.statLabel}>Risk Level</div>
          <div className={`${styles.statValue} ${styles.amber}`}>Medium</div>
          <div className={`${styles.statBadge} ${styles.badgeAmber}`}>+3 pts today</div>
          <div className={styles.statSub}>Elevated caution zone</div>
        </div>
      </div>

      {/* Agent Logs */}
      <div className={styles.statCard}>
        <div className={styles.statInfo}>
          <div className={styles.statLabel}>Live AI Agent Logs</div>
          <div className={styles.statValue}>
            103 <span className={styles.statUnit}>Agents Active</span>
          </div>
          <div className={styles.sparkBar}>
            {SPARK_AGENTS.map((h, i) => (
              <span key={i} style={{ height: h, background: '#00e676', opacity: 0.4 + h / 40 }} />
            ))}
          </div>
          <div className={styles.statSub}>All systems nominal</div>
        </div>
      </div>

      {/* Transactions Scanned */}
      <div className={styles.statCard}>
        <div className={styles.statInfo}>
          <div className={styles.statLabel}>Transactions Scanned</div>
          <div className={styles.statValue}>{txCount.toLocaleString()}</div>
          <div className={`${styles.statBadge} ${styles.badgeGreen}`}>+15% Today</div>
          <div className={styles.sparkBar}>
            {SPARK_TX.map((h, i) => (
              <span key={i} style={{ height: h, background: '#448aff', opacity: 0.4 + h / 40 }} />
            ))}
          </div>
          <div className={`${styles.statSub} ${styles.green}`}>98.4% Secure</div>
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;
