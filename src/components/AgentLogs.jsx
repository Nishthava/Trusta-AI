import React, { useEffect, useRef } from 'react';
import styles from './AgentLogs.module.css';

const STATIC_ENTRIES = [
  { agent: 'AGT-04', msg: 'Cleared ₹5,500 — risk score: 12 · ALLOW', time: '2s ago', color: 'green' },
  { agent: 'AGT-11', msg: 'Flagged unknown UPI — receiver unverified', time: '14s ago', color: 'red' },
  { agent: 'AGT-07', msg: 'Escalated ₹92,000 — critical amount threshold', time: '1m ago', color: 'amber' },
  { agent: 'AGT-02', msg: 'Verified device fingerprint — registered device confirmed', time: '3m ago', color: 'cyan' },
];

const AgentLogs = ({ logs, isThinking }) => {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={`${styles.activeDot} ${isThinking ? styles.pulsing : ''}`}></div>
          <div>
            <div className={styles.headTitle}>
              {isThinking ? 'AGENT_ANALYSIS_IN_PROGRESS' : 'AGENT_IDLE'}
            </div>
            <div className={styles.headSub}>SYS_SEC_v2.4 · Monitoring</div>
          </div>
        </div>
        <span className={styles.liveBadge}>● LIVE</span>
      </div>

      {/* Static timeline OR live agent analysis logs */}
      {logs.length === 0 && !isThinking ? (
        /* Static  timeline from HTML */
        <div className={styles.timeline}>
          {STATIC_ENTRIES.map((e, i) => (
            <div key={i} className={styles.tlEntry}>
              <div className={styles.tlLeft}>
                <div className={`${styles.tlDot} ${styles[e.color]}`}></div>
                {i < STATIC_ENTRIES.length - 1 && <div className={styles.tlLine}></div>}
              </div>
              <div className={styles.tlContent}>
                <div className={styles.tlAgent}>{e.agent}</div>
                <div className={styles.tlMsg}>{e.msg}</div>
                <div className={styles.tlTime}>{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Live scrolling log entries during analysis */
        <div className={styles.logsBox}>
          {logs.map((log, idx) => (
            <div key={idx} className={`${styles.logEntry} ${styles[log.type]}`}>
              <span className={styles.timestamp}>[{log.timestamp}]</span>
              <span className={styles.message}>{log.message}</span>
            </div>
          ))}
          {isThinking && (
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
};

export default AgentLogs;
