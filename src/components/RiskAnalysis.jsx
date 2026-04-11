import React from 'react';
import styles from './RiskAnalysis.module.css';

const RiskAnalysis = ({ decisionData }) => {
  if (!decisionData) return null;

  const { riskScore, reasoning, decision } = decisionData;

  const getDecisionStyles = () => {
    switch (decision) {
      case 'ALLOW':
        return styles.allow;
      case 'OTP':
        return styles.otp;
      case 'BLOCK':
      default:
        return styles.block;
    }
  };

  return (
    <div className={`glass-panel ${styles.container}`}>
      <h2 className={styles.title}>Final Decision Output</h2>
      
      <div className={styles.decisionBadgeContainer}>
        <div className={`${styles.badge} ${getDecisionStyles()}`}>
          <span className={styles.badgeLabel}>STATUS:</span>
          <span className={styles.badgeValue}>{decision}</span>
        </div>
      </div>

      <div className={styles.meterContainer}>
        <div className={styles.meterHeader}>
          <span className={styles.meterTitle}>Threat Risk Index</span>
          <span className={styles.meterValue}>{riskScore} / 100</span>
        </div>
        <div className={styles.meterTrack}>
          <div 
            className={`${styles.meterFill} ${getDecisionStyles()}`} 
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      <div className={styles.reasoningContainer}>
        <h3 className={styles.reasoningTitle}>Agent Explanation</h3>
        <ul className={styles.reasonList}>
          {reasoning.map((item, idx) => (
            <li key={idx} className={styles.reasonItem}>
              <span className={`${styles.reasonDot} ${styles[item.type]}`}></span>
              <span className={styles.reasonText}>{item.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskAnalysis;
