import React, { useState } from 'react';
import styles from './TransactionForm.module.css';

const TransactionForm = ({ onSubmit, disabled }) => {
  const [formData, setFormData] = useState({
    amount: '',
    senderUPI: 'saksham@okaxis',
    receiverUPI: '',
    isNewDevice: false,
    isLocationChanged: false,
    frequency: 'low',
    isReceiverNew: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.receiverUPI) return;
    onSubmit(formData);
  };

  return (
    <div className={`glass-panel ${styles.formContainer}`}>
      <h2 className={styles.title}>Transaction Input</h2>
      <p className={styles.subtitle}>Initialize payment node</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="e.g. 55000"
            value={formData.amount}
            onChange={handleChange}
            disabled={disabled}
            required
            min="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="receiverUPI">Receiver UPI ID</label>
          <input
            type="text"
            id="receiverUPI"
            name="receiverUPI"
            placeholder="e.g. unknown@ybl"
            value={formData.receiverUPI}
            onChange={handleChange}
            disabled={disabled}
            required
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isReceiverNew"
              name="isReceiverNew"
              checked={formData.isReceiverNew}
              onChange={handleChange}
              disabled={disabled}
            />
            <label htmlFor="isReceiverNew">New Receiver</label>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isNewDevice"
              name="isNewDevice"
              checked={formData.isNewDevice}
              onChange={handleChange}
              disabled={disabled}
            />
            <label htmlFor="isNewDevice">New Device</label>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isLocationChanged"
              name="isLocationChanged"
              checked={formData.isLocationChanged}
              onChange={handleChange}
              disabled={disabled}
            />
            <label htmlFor="isLocationChanged">Location Changed</label>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="frequency">Recent Transaction Frequency</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="low">Low (1-2 today)</option>
            <option value="medium">Medium (3-5 today)</option>
            <option value="high">High (&gt;5 today)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={disabled || !formData.amount || !formData.receiverUPI}
        >
          {disabled ? 'Processing...' : 'Initiate Transfer'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
