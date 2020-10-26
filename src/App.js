import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import cookie from 'js-cookie';
import client from './GraphQL/client';
import { AuthContext } from './context/Context';
import './App.css';
import LandingPage from './views/landinPage/landingPage';
import MainApp from './views/mapApp/mapApp';

function App() {
  const [isLoggedIn, changeIsLoggedIn] = useState(cookie.get('signedin') === 'true');
  const [user, changeUser] = useState({ type: null, id: null, email: null, phone: null });
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          isLoggedIn,
          user,
          setIsLoggedIn: (bool) => changeIsLoggedIn(bool),
          setUser: (who) => changeUser(who),
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route exact path="/map">
              {isLoggedIn ? (
                <MainApp
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDzTMGTd-pTdPr5_Xo-xxpl-Jjd-CbpPtw&v=3.exp&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: `100vh` }} />}
                  containerElement={<div style={{ height: `100vh` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              ) : (
                <LandingPage />
              )}
            </Route>
            <Route exact path="/howtohelp">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10%',
                  alignItems: 'center',
                }}
              >
                <iframe
                  title="help"
                  width="411"
                  height="264"
                  src="https://www.youtube.com/embed/xrDilEoPlNw"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <Link to="/map">
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      marginTop: '100px',
                      borderRadius: '20px',
                      background: '#00A8FF',
                      marginLeft: '45%',
                      alignContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                      height: '40px',
                      width: '70px',
                    }}
                  >
                    Back
                  </button>
                </Link>
              </div>
            </Route>
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
