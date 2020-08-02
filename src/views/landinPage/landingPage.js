/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import styles from './landing.module.css';
import { useAuth } from '../../context/Context';

import SIGN_IN from '../../GraphQL/mutation/signin';
import SIGN_UP from '../../GraphQL/mutation/signup';

import { ReactComponent as Ambulance } from '../../assets/svgs/ambulance.svg';
import Toast from '../../utils/toast';

const Modal = ({ mode, closeModal }) => {
  const auth = useAuth();
  const history = useHistory();
  const [location, changeLocation] = useState(null);
  const [signin, signinData] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      if (data?.signin?.code === '200') {
        auth.setIsLoggedIn(true);
        history.push('/map');
      }
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        title: error.message,
      });
    },
  });
  const [signup, signupData] = useMutation(SIGN_UP, {
    onCompleted: (data) => {
      if (data?.signup?.code === '200') {
        Toast.fire({
          icon: 'success',
          title: 'Successfully Signed Up. Login with ur new credentials to continue',
        });
        closeModal('Sign in');
      }
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        title: error.message,
      });
    },
  });
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
  });
  const onSubmit = (data, e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      const positionOptions = {
        enableHighAccuracy: true,
      };

      navigator.geolocation.getCurrentPosition(
        (positionObj) => {
          changeLocation({
            lat: positionObj.coords.latitude,
            lng: positionObj.coords.longitude,
            speed: positionObj.coords.speed,
          });
          if (mode === 'Sign up') {
            signup({
              variables: {
                ...data,
                lat: positionObj.coords.latitude.toString(),
                lng: positionObj.coords.longitude.toString(),
              },
            });
          } else {
            signin({
              variables: {
                ...data,
                lat: positionObj.coords.latitude.toString(),
                lng: positionObj.coords.longitude.toString(),
              },
            });
          }
        },
        (error) => {
          console.log(error);
        },
        positionOptions
      );
    }
  };

  return (
    <>
      <div className={styles.modal_wrapper} onClick={() => closeModal(null)} />
      <div className={styles.modal}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h1>{mode}</h1>
          {mode === 'Sign up' ? (
            <>
              <span className={styles.input_entity}>
                <label className={styles.label}>Name</label>
                <input
                  name="name"
                  type="text"
                  className={styles.input}
                  ref={register({ required: true })}
                  placeholder="Enter your Name"
                />
                {errors.name && <p className={styles.error_message}>This field is required</p>}
              </span>
            </>
          ) : null}
          <span className={styles.input_entity}>
            <label className={styles.label}>E-mail</label>
            <input
              name="email"
              type="email"
              className={styles.input}
              ref={register({ required: true })}
              placeholder="Enter email address"
            />
            {errors.email && <p className={styles.error_message}>This field is required</p>}
          </span>

          <span className={styles.input_entity}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              className={styles.input}
              ref={register({ required: true })}
              placeholder="Enter password"
            />
            {errors.password && <p className={styles.error_message}>This field is required</p>}
          </span>

          {mode === 'Sign up' ? (
            <>
              <span className={styles.input_entity}>
                <label className={styles.label}>phone</label>
                <input
                  name="phone"
                  type="phone"
                  className={styles.input}
                  ref={register({ required: true })}
                  placeholder="Enter your Phone"
                />
                {errors.phone && <p className={styles.error_message}>This field is required</p>}
              </span>
              <span className={styles.input_entity}>
                <label className={styles.label}>Priority User</label>
                <input
                  name="priority"
                  type="checkbox"
                  style={{ alignSelf: 'flex-start' }}
                  // className={styles.input}
                  ref={register({ required: false })}
                  placeholder="Enter your Phone"
                />
                {errors.priority && <p className={styles.error_message}>This field is required</p>}
              </span>
            </>
          ) : null}
          <button type="submit" className={styles.button_modal}>
            {mode}
          </button>
        </form>
      </div>
    </>
  );
};

const LandingPage = () => {
  const auth = useAuth();
  const history = useHistory();
  const [isModalOpen, changeIsModalOpen] = useState(null);
  const handleGuestAuth = () => {
    auth.setIsLoggedIn(true);
    auth.setUser({
      type: 'GUEST',
      id: null,
      name: null,
      email: null,
      phone: null,
    });
    history.push('/map');
  };
  return (
    <div className={styles.landing}>
      {isModalOpen ? <Modal mode={isModalOpen} closeModal={changeIsModalOpen} /> : null}
      <div className={styles.left}>
        <h2 className={styles.h2}>Welcome to</h2>
        <h1 className={styles.h1}>PRIMAL</h1>
        <div className={styles.button_container}>
          <button
            type="button"
            className={styles.button_signin}
            onClick={() => changeIsModalOpen('Sign in')}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => changeIsModalOpen('Sign up')}
            className={styles.button_signup}
          >
            Sign up
          </button>
        </div>
        <button type="button" className={styles.guestButton} onClick={handleGuestAuth}>
          Continue as Guest User
        </button>
      </div>
      <hr className={styles.divider} />
      <div className={styles.right}>
        <Ambulance className={styles.ambulance} />
        <p className={styles.p}>
          Better and faster emergency care during accidents and vehicle impact.
        </p>
      </div>
    </div>
  );
};
export default LandingPage;
