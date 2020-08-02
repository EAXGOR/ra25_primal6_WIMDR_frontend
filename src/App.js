import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import cookie from 'js-cookie';
import client from './GraphQL/client';
import { AuthContext } from './context/Context';
import './App.css';
import LandingPage from './views/landinPage/landingPage';

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
            <Route exact path="/map" />
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
