/* eslint-disable react/jsx-indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from 'react-google-maps';
import { createLocation } from 'geolocation-utils';
import { useLazyQuery } from '@apollo/react-hooks';
import styles from './map.module.css';
import userMark from '../../assets/svgs/userMark.svg';
import ambulanceMark from '../../assets/svgs/ambulance-mark.svg';
import RotateIcon from '../../components/Icon/Icon';

import NavBar from '../../components/navbar/NavBar';
import CreateEmergency from '../../components/create Emergency/createEmergency';
import Toast from '../../utils/toast';
import AlertBox from '../../components/alertBox/alertBox';

import GET_ALERT from '../../GraphQL/query/getAlert';
import GET_USER from '../../GraphQL/query/user';
import { useAuth } from '../../context/Context';
import GET_REQUEST from '../../GraphQL/query/getRequests';
import GET_CURRENT from '../../GraphQL/query/getCurrent';

const MainApp = withScriptjs(
  withGoogleMap((props) => {
    const [location, changeLocation] = useState({
      lat: 25.429552871347898,
      lng: 81.7876428357208,
      speed: null,
    });
    const [isApiLoaded, changeIsApiLoaded] = useState(false);
    const [navDestination, changeNavDestination] = useState(null);
    const [directionObj, changeDirectionObj] = useState(null);
    const [userDeg, changeUserDeg] = useState(0);
    const [alertEmergencies, changeAlertEmergencies] = useState([]);
    const [emergencyDirectionsObj, changeEmergencyDirectionsObj] = useState([]);
    const [currentEmergencyDirectionObj, changeCurrentEmergencyDirectionObj] = useState(null);
    const auth = useAuth();

    const [fireGetAlert, getAlertData] = useLazyQuery(GET_ALERT, {
      pollInterval: 10000,
      fetchPolicy: 'network-only',
    });
    const [getRequest, getRequestData] = useLazyQuery(GET_REQUEST, {
      pollInterval: 10000,
      fetchPolicy: 'network-only',
    });
    const [getCurrent, getCurrentData] = useLazyQuery(GET_CURRENT, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        auth.setUser({
          ...auth.user,
          currentEmergency: data?.getCurrent,
        });
      },
      onError: (error) => {
        Toast.fire({
          icon: 'error',
          title: error.message,
        });
      },
    });
    const [getUser, getUserData] = useLazyQuery(GET_USER, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data?.me) {
          console.log(data);
          auth.setUser({
            ...auth.user,
            type: data?.me?.roles[0],
            id: data?.me?.id,
            name: data?.me?.name,
            email: data?.me?.email,
            phone: data?.me?.phone,
            emergenciesCreated: data?.me?.emergenciesCreated,
          });
          if (data.me.roles[0] === 'PRIORITY_USER') {
            getRequest();
            getCurrent();
          }
        }
      },
      onError: (error) => {
        Toast.fire({
          icon: 'error',
          title: error.message,
        });
      },
    });

    const startNav = (isNav, isPrioNav, origin, destination) => {
      const directionsService = new window.google.maps.DirectionsService();
      if (isNav) {
        if (navDestination) {
          changeDirectionObj(null);

          directionsService.route(
            {
              origin: location,
              destination: navDestination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                changeDirectionObj(result);
                console.log(result);
              } else {
                Toast.fire({
                  icon: 'error',
                  title: 'Error fetching Directions',
                });
              }
            }
          );
        }
      } else {
        if (isPrioNav) {
          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                changeCurrentEmergencyDirectionObj(result);
                console.log(result);
              } else {
                Toast.fire({
                  icon: 'error',
                  title: 'Error fetching Directions',
                });
              }
            }
          );
        }
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              changeEmergencyDirectionsObj([...emergencyDirectionsObj, result]);
              console.log(result);
            } else {
              Toast.fire({
                icon: 'error',
                title: 'Error fetching Directions',
              });
            }
          }
        );
      }
    };

    const handleOrientation = (event) => {
      let { alpha, beta, gamma, absolute } = event;
      if (!alpha && !beta && !absolute) {
        alpha = 0;
        beta = 0;
        gamma = 0;
        absolute = 0;
        changeUserDeg(0);
      } else {
        // const rad = Math.atan(alpha / beta);
        // const deg = (rad * 180) / Math.PI;
        changeUserDeg(alpha);
      }
    };

    useEffect(() => {
      if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        changeIsApiLoaded(true);
      }
    }, [window?.google, window?.google?.maps]);

    useEffect(() => {
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
          },
          (error) => {
            console.log(error);
          },
          positionOptions
        );

        navigator.geolocation.watchPosition(
          (positionObj) => {
            changeLocation({
              lat: positionObj.coords.latitude,
              lng: positionObj.coords.longitude,
              speed: positionObj.coords.speed,
            });
            // getAlertData.stopPolling();
            fireGetAlert({
              variables: {
                latitude: positionObj.coords.latitude.toString(),
                longitude: positionObj.coords.longitude.toString(),
              },
            });
          },
          (error) => {
            console.log(error);
          },
          positionOptions
        );
      }
      window.addEventListener('deviceorientation', handleOrientation, true);

      return () => {
        window.removeEventListener('deviceorientation', null);
      };
    }, []);

    useEffect(() => {
      if (auth.isLoggedIn) {
        if (auth.user.type !== 'GUEST') {
          getUser();
        }
        fireGetAlert({
          variables: { latitude: location.lat.toString(), longitude: location.lng.toString() },
        });
      }
    }, [auth?.isLoggedIn, auth?.user?.type]);

    useEffect(() => {
      if (getAlertData?.data) {
        changeAlertEmergencies(getAlertData?.data?.getEmergencyAlert || []);
        console.log(getAlertData?.data?.getEmergencyAlert);
      }
    }, [getAlertData?.data, isApiLoaded]);

    useEffect(() => {
      if (isApiLoaded)
        alertEmergencies.forEach((element) => {
          startNav(
            false,
            false,
            createLocation(
              parseFloat(element?.handledBy?.location?.latitude),
              parseFloat(element?.handledBy?.location?.longitude),
              'LatLng'
            ),
            createLocation(
              parseFloat(element?.location?.latitude),
              parseFloat(element?.location?.longitude),
              'LatLng'
            )
          );
        });
    }, [alertEmergencies]);

    useEffect(() => {
      if (getUserData?.data) {
        auth.setUser({
          ...auth.user,
          type: getUserData?.data?.me?.roles[0],
          id: getUserData?.data?.me?.id,
          name: getUserData?.data?.me?.name,
          email: getUserData?.data?.me?.email,
          phone: getUserData?.data?.me?.phone,
          emergenciesCreated: getUserData?.data?.me?.emergenciesCreated,
        });
      }
    }, [getUserData?.data]);

    useEffect(() => {
      if (getRequestData?.data) {
        auth.setUser({
          ...auth.user,
          emergenciesRequests: getRequestData?.data?.getRequests,
        });
      }
    }, [getRequestData?.data]);

    useEffect(() => {
      if (getCurrentData?.data) {
        auth.setUser({
          ...auth.user,
          currentEmergency: getCurrentData?.data?.getCurrent,
        });
      }
    }, [getCurrentData?.data]);
    useEffect(() => {
      if (auth.user.currentEmergency) {
        startNav(
          false,
          true,
          createLocation(parseFloat(location.lat), parseFloat(location.lng), 'LatLng'),
          createLocation(
            parseFloat(auth?.user?.currentEmergency?.location?.latitude),
            parseFloat(auth?.user?.currentEmergency?.location?.longitude),
            'LatLng'
          )
        );
      } else {
        changeCurrentEmergencyDirectionObj(null);
      }
    }, [auth?.user?.currentEmergency]);
    console.log(auth);

    return (
      <>
        <AlertBox isActive={alertEmergencies.length > 0} />
        <NavBar
          api={isApiLoaded}
          changeNavDestination={changeNavDestination}
          navDestination={navDestination}
          startNav={startNav}
          refetch={getUserData.refetch}
          getCurrent={getCurrentData.refetch}
        />
        {auth.user.type !== 'GUEST' ? (
          <CreateEmergency
            changeEmergencyLocation={changeNavDestination}
            isApiLoaded={isApiLoaded}
            navLocation={navDestination}
            location={location}
            refetch={getUserData.refetch}
            getCurrent={getCurrentData.refetch}
            getCurrentData={getCurrentData}
          />
        ) : null}
        <GoogleMap
          defaultZoom={18}
          defaultCenter={{ lat: location.lat, lng: location.lng }}
          onClick={(obj) => {
            changeNavDestination(null);
            changeNavDestination({ lat: obj.latLng.lat(), lng: obj.latLng.lng() });
          }}
        >
          <Marker
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              url: RotateIcon.makeIcon(auth.user.currentEmergency ? ambulanceMark : userMark)
                .setRotation({ deg: -userDeg })
                .getUrl(),
              scaledSize: new window.google.maps.Size(60, 60),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 30),
            }}
          />

          <Marker
            position={{
              lat: navDestination?.lat || 0,
              lng: navDestination?.lng || 0,
            }}
            draggable
            onDragEnd={(e) => {
              changeNavDestination({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }}
            opacity={navDestination ? 1 : 0}
          />
          {auth.user.currentEmergency !== null &&
            getAlertData?.data?.getAlert?.map((a, index) => (
              <Marker
                position={{
                  lat: a.handledBy.location.latitude,
                  lng: a.handledBy.location.longitude,
                }}
                icon={{
                  url: RotateIcon.makeIcon(ambulanceMark).setRotation({ deg: -userDeg }).getUrl(),
                  scaledSize: new window.google.maps.Size(60, 60),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(30, 30),
                }}
              />
            ))}
          {directionObj ? (
            <DirectionsRenderer directions={directionObj} options={{ preserveViewport: true }} />
          ) : null}
          {auth?.user?.currentEmergency === undefined || auth?.user?.currentEmergency === null ? (
            emergencyDirectionsObj.map((a, index) => {
              return (
                <DirectionsRenderer
                  directions={a}
                  options={{ polylineOptions: { strokeColor: 'red' }, preserveViewport: true }}
                />
              );
            })
          ) : (
            <DirectionsRenderer
              directions={currentEmergencyDirectionObj}
              options={{ polylineOptions: { strokeColor: 'red' }, preserveViewport: true }}
            />
          )}
          {auth?.user?.currentEmergency === undefined || auth?.user?.currentEmergency === null
            ? alertEmergencies.map((e) => (
                <Marker
                  position={{
                    lat: e?.handledBy?.location?.latitude,
                    lng: e?.handledBy?.location?.longitude,
                  }}
                  icon={{
                    url: RotateIcon.makeIcon(ambulanceMark).setRotation({ deg: -userDeg }).getUrl(),
                    scaledSize: new window.google.maps.Size(60, 60),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(30, 30),
                  }}
                />
              ))
            : null}
        </GoogleMap>
      </>
    );
  })
);

export default MainApp;
