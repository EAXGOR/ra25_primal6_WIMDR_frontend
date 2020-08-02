import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
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
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBbimgXHjyObzS-WpF4LXZ1T1585TnEoh4&v=3.exp&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: `100vh` }} />}
                  containerElement={<div style={{ height: `100vh` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              ) : (
                <LandingPage />
              )}
            </Route>
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
