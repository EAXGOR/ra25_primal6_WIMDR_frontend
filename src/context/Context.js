import { createContext, useContext } from 'react';

const auth = {
  isLoggedIn: false,
  user: {
    type: null,
    id: null,
    name: null,
    email: null,
    phone: null,
  },
  setIsLoggedIn: () => {},
  setUser: () => {},
};
export const AuthContext = createContext(auth);
export const useAuth = () => {
  return useContext(AuthContext);
};
