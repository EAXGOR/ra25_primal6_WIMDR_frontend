/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import styles from './nav.module.css';
import { ReactComponent as MapSvg } from '../../assets/svgs/maps.svg';
import { ReactComponent as Burger } from '../../assets/svgs/burger.svg';
import { useAuth } from '../../context/Context';

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

const NavBar = ({ api, changeNavDestination, navDestination, startNav }) => {
  const auth = useAuth();
  const [isNavOpen, changeIsNavOpen] = useState(true);
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
        hi
        {auth.user.name}
      </h2>
      <div className={styles.requests} />
    </div>
  );
};

export default NavBar;
