import React, { useState } from 'react';
import styles from './TransactionForm.module.css';

const TransactionForm = ({ onSubmit, disabled }) => {
  const [formData, setFormData] = useState({
  amount: '',
  receiverUPI: '',
});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("UPI:", formData.receiverUPI);
    const response = await fetch("http://127.0.0.1:8000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        txn_id: "T" + Date.now(),
        receiver_upi: formData.receiverUPI,
        amount: Number(formData.amount)
      })
    });

    const data = await response.json();

    console.log("Response:", data);

    onSubmit(data); // send result to parent

  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className={`glass-panel ${styles.formContainer}`}>
      <h2 className={styles.title}>Initialize Transfer</h2>
      <p className={styles.subtitle}>Secure Payment Node</p>
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
