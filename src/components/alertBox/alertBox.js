/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import styles from './alert.module.css';
import { useAuth } from '../../context/Context';

const AlertBox = ({ isActive, showGif }) => {
  const auth = useAuth();
  if (!auth.user.currentEmergency && isActive)
    return (
      <div className={styles.alertBox}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <h2 className={styles.h2}>Emergency Alert!</h2>
          <p className={styles.p}>
            Theres an ambulance in your vicinity please drive slow and let it pass
          </p>
        </div>
      </div>
    );
  return null;
};
export default AlertBox;
