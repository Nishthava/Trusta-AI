import React, { useEffect, useRef } from 'react';
import styles from './AgentLogs.module.css';

const AgentLogs = ({ logs, isThinking }) => {
  const endOfLogsRef = useRef(null);

  useEffect(() => {
    if (endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.statusIndicator}>
          <div className={`${styles.dot} ${isThinking ? styles.pulsing : ''}`}></div>
          <span className="mono-text">
            {isThinking ? 'AGENT_ANALYSIS_IN_PROGRESS' : 'AGENT_IDLE'}
          </span>
        </div>
        <div className={styles.systemInfo}>
          SYS_SEC_v2.4
        </div>
      </div>

      <div className={`${styles.logsBox} mono-text`}>
        {logs.length === 0 && !isThinking ? (
          <div className={styles.placeholder}>Waiting for transaction input...</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`${styles.logEntry} ${styles[log.type]}`}>
              <span className={styles.timestamp}>[{log.timestamp}]</span>
              <span className={styles.message}>{log.message}</span>
            </div>
          ))
        )}
        {isThinking && (
          <div className={styles.typingIndicator}>
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};

export default AgentLogs;
