import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        // Check for user in localStorage
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      if (response.success) {
        // Save user data
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'An error occurred during login'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Auth context value
  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
