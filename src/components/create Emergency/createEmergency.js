/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import FIRE_EMERGENCY from '../../GraphQL/mutation/createEmergency';

import styles from './emer.module.css';
import { AutoCompleteInput } from '../navbar/NavBar';
import Toast from '../../utils/toast';
import { useAuth } from '../../context/Context';

import COMPLETE_EMERGENCY from '../../GraphQL/mutation/completeEmergency';

const CreateEmergency = ({
  changeEmergencyLocation,
  isApiLoaded,
  navLocation,
  refetch,
  getCurrent,
  getCurrentData,
}) => {
  const auth = useAuth();
  const [check, changeCheck] = useState(false);
  const [text, changeText] = useState('');
  const [open, changeOpen] = useState(false);

  const [completeEmergency, changeCompleteEmergency] = useMutation(COMPLETE_EMERGENCY, {
    onCompleted: (data) => {
      Toast.fire({
        icon: 'success',
        title: 'Successfully completed Emergency',
      });
      auth.setUser({
        ...auth.user,
        currentEmergency: null,
      });
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        title: error.message,
      });
    },
  });

  const [fireEmergency, fireEmergencyData] = useMutation(FIRE_EMERGENCY, {
    onCompleted: (data) => {
      if (data.createEmergency.code === '200') {
        Toast.fire({
          icon: 'success',
          title: 'Emergency successfully Submitted',
        });
        if (auth.user.type === 'PRIORITY_USER') {
          getCurrent();
        }
        // refetch();
      }
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        title: error.message,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fireEmergency({
      variables: {
        lat: String(navLocation.lat),
        lng: String(navLocation.lng),
        description: text,
        self: check,
      },
    });
  };

  const handleComplete = () => {
    completeEmergency({ variables: { emergencyID: getCurrentData?.data?.getCurrent?.id } });
    refetch();
  };

  return (
    <>
      {auth.user.currentEmergency ? (
        <div className={styles.current_box}>
          You are handling Emergency ID {getCurrentData?.data?.getCurrent?.id}
          <button type="button" onClick={handleComplete}>
            MARK AS COMPLETE
          </button>
        </div>
      ) : null}
      <button className={styles.opener} type="button" onClick={() => changeOpen(!open)}>
        +
      </button>
      {open ? (
        <div className={styles.parent}>
          <h2 className={styles.head}>Create Emergency</h2>
          <div className={styles.form}>
            {isApiLoaded ? (
              <AutoCompleteInput
                changeLatLng={changeEmergencyLocation}
                placeholder="Enter emergency Location ..."
              />
            ) : null}
            <input
              type="text"
              className={styles.input}
              onChange={(e) => changeText(e.target.value)}
              value={text}
              placeholder="enter description"
            />
            <span className={styles.span}>
              <label className={styles.label}>Self Assign this emergency</label>
              <input
                type="Checkbox"
                onChange={(e) => changeCheck(e.target.checked)}
                value={check}
              />
            </span>
            <button type="submit" className={styles.submit} onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CreateEmergency;
