import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode'; 
//context  creating
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Checkingif a token exists and is valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Checking if token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({
            id: decodedUser.userId,
            fullName: decodedUser.fullName,
          });
        } else {
          // Token is expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token found in localStorage", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser({
      id: decodedUser.userId,
      fullName: decodedUser.fullName,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};