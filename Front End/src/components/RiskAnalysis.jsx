import React, { useEffect, useRef } from 'react';
import styles from './RiskAnalysis.module.css';

const BREAKDOWN = [
  { label: 'Velocity anomaly',    value: 6, max: 10, color: 'red' },
  { label: 'New receiver pattern', value: 4, max: 10, color: 'amber' },
  { label: 'Location mismatch',   value: 3, max: 10, color: 'amber' },
  { label: 'Large amount flag',   value: 1, max: 10, color: 'cyan' },
];

const getBadgeType = (type) => {
  if (type === 'danger' || type === 'warning') return 'warn';
  return 'pass';
};

const RiskAnalysis = ({ decisionData }) => {
  const fillRef = useRef(null);

  useEffect(() => {
    // Animate bar on mount
    if (fillRef.current) {
      setTimeout(() => {
        fillRef.current.style.width = `${decisionData.riskScore}%`;
      }, 100);
    }
  }, [decisionData]);

  if (!decisionData) return null;
  const { riskScore, reasoning, decision } = decisionData;

  const statusColor = decision === 'ALLOW' ? 'green' : decision === 'WARN' ? 'amber' : 'red';

  return (
    <div className={`${styles.container} ${styles.visible}`}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={`${styles.statusDot} ${styles[statusColor]}`}></div>
          <span className={styles.cardTitle}>Final Decision Output</span>
        </div>
        <span className={styles.timestamp}>
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>

      <div className={styles.body}>
        {/* Status pill */}
        <div className={`${styles.statusPill} ${styles[statusColor]}`}>
          ✦ STATUS: {decision}
        </div>

        {/* Risk meter */}
        <div className={styles.riskSection}>
          <div className={styles.riskHeader}>
            <span className={styles.riskLabel}>Threat Risk Index</span>
            <span className={styles.riskScore}>{riskScore} / 100</span>
          </div>
          <div className={styles.riskTrack}>
            <div
              ref={fillRef}
              className={`${styles.riskFill} ${styles[statusColor]}`}
              style={{ width: 0 }}
            />
          </div>
        </div>

        {/* Factor rows */}
        <div className={styles.factors}>
          {(reasoning || []).map((item, idx) => (
            <div key={idx} className={styles.factorRow}>
              <div className={`${styles.factorDot} ${styles[item.type === 'danger' ? 'red' : item.type === 'warning' ? 'amber' : 'green']}`}></div>
              <div className={styles.factorText}>{item.message}</div>
              <div className={`${styles.factorBadge} ${styles[getBadgeType(item.type)]}`}>
                {getBadgeType(item.type) === 'pass' ? 'Pass' : 'Warn'}
              </div>
            </div>
          ))}
        </div>

        {/* Threat breakdown */}
        <div className={styles.breakdownSection}>
          <div className={styles.breakdownTitle}>Threat Category Breakdown</div>
          <div className={styles.breakdownRows}>
            {BREAKDOWN.map((b, i) => (
              <div key={i} className={styles.breakdownRow}>
                <div className={styles.breakdownLabel}>{b.label}</div>
                <div className={styles.breakdownTrack}>
                  <div
                    className={`${styles.breakdownFill} ${styles[b.color]}`}
                    style={{ width: `${(b.value / b.max) * 100}%` }}
                  />
                </div>
                <div className={`${styles.breakdownVal} ${styles[b.color]}`}>{b.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
