/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useMutation } from '@apollo/react-hooks';
import styles from './nav.module.css';
import { ReactComponent as MapSvg } from '../../assets/svgs/maps.svg';
import { ReactComponent as Burger } from '../../assets/svgs/burger.svg';
import { useAuth } from '../../context/Context';
import HANDLE_EMERGENCY from '../../GraphQL/mutation/handleRequest';
import SIGN_OUT from '../../GraphQL/mutation/signout';
import Toast from '../../utils/toast';

export const AutoCompleteInput = ({ changeLatLng, placeholder, navDestination }) => {
  const [address, changeAddress] = useState();

  const handleSelect = (add) => {
    changeAddress(add);
    geocodeByAddress(address)
      .then((results) =>
        getLatLng(results[0])
          .then((latLng) => changeLatLng(latLng))
          .catch((err) => console.log(err))
      )
      .catch((error) => console.error('Error', error));
  };
  return (
    <PlacesAutocomplete
      value={address}
      onChange={changeAddress}
      onSelect={handleSelect}
      debounce={1000}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.auto}>
          <input
            {...getInputProps({
              placeholder,
              className: styles.location_search_input,
            })}
          />
          <div className={styles.auto_complete_dropdown_container}>
            {loading && <div className={styles.loading}>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

const NavBar = ({ api, changeNavDestination, navDestination, startNav, refetch, getCurrent }) => {
  const auth = useAuth();
  const [isNavOpen, changeIsNavOpen] = useState(true);
  const history = useHistory();

  const [handleEmergency, handleEmergencyData] = useMutation(HANDLE_EMERGENCY, {
    onComplete: (data) => {
      Toast.fire({
        icon: 'success',
        title: 'Handling Request successfully sent',
      });
      refetch();
      getCurrent();
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        title: error.message,
      });
    },
  });

  const [signout, signoutData] = useMutation(SIGN_OUT, {
    onCompleted: (data) => {
      Toast.fire({
        icon: 'success',
        title: 'Signed Out Successfully',
      });
      auth.setUser({
        type: null,
        id: null,
        name: null,
        email: null,
        phone: null,
      });
      auth.setIsLoggedIn(false);
      history.push('/');
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        title: error.message,
      });
    },
  });
  const handleSignOut = () => {
    if (auth.user.type === 'GUEST') {
      auth.setUser({
        type: null,
        id: null,
        name: null,
        email: null,
        phone: null,
      });
      auth.setIsLoggedIn(false);
    } else signout();
  };
  const handleAccept = (id) => {
    handleEmergency({
      variables: {
        emergencyID: id,
      },
    });
  };
  return (
    <div
      className={isNavOpen ? styles.nav_parent : `${styles.nav_parent} ${styles.nav_parent_close}`}
    >
      <div className={styles.close_button_wrapper}>
        <button
          className={styles.nav_close}
          type="button"
          onClick={() => changeIsNavOpen(!isNavOpen)}
        >
          <Burger />
        </button>
      </div>
      <div className={styles.colored}>
        <div className={styles.nav_head}>
          <h2 className={styles.h2}>Navigate</h2>
          <MapSvg className={styles.map_svg} />
        </div>
        <hr className={styles.hr} />
        <div className={styles.direction_input_box}>
          {api ? (
            <>
              <AutoCompleteInput
                changeLatLng={changeNavDestination}
                placeholder="Enter desitination address"
                navDestination={navDestination}
              />
              <button className={styles.nav_button} type="button" onClick={() => startNav(true)}>
                Start Navigation
              </button>
            </>
          ) : null}
        </div>
      </div>
      <h2>
        hi&nbsp;
        {auth.user.name}
      </h2>
      {auth?.user?.emergenciesRequests !== null || auth?.user?.emergenciesRequests !== undefined
        ? auth?.user?.emergenciesRequests?.map((e) => (
            <div className={styles.requests}>
              There's an Emergency Request at latitude : {e?.location?.latitude} and longitude :
              {e?.location?.longitude}
              <button
                type="button"
                onClick={() => handleAccept(e.id)}
                className={styles.accept_button}
              >
                Accept
              </button>
            </div>
          ))
        : null}
      <div style={{ marginTop: '20px', marginRight: '40px', marginBottom: '20px' }}>
        <Link to="/howtohelp">
          <div>
            <ul>How to help ?</ul>
          </div>
        </Link>
      </div>
      <button type="button" className={styles.signout} onClick={handleSignOut}>
        Signout
      </button>
    </div>
  );
};

export default NavBar;
