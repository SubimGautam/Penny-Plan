import React, { useState, useEffect } from "react";  // Updated to include useEffect
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import styles from "./App.module.css";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could add an API call here to verify the token and get user data
      // For now, we'll just set a minimal user object
      setUser({ authenticated: true });
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user; // Convert user to boolean for your original logic

  return (
    <>
      {/* Show header only on non-dashboard routes */}
      {!location.pathname.startsWith("/dashboard") && (
        <header className={styles.header}>
          {/* Penny PLAN Text */}
          <Link to="/" className={styles.pennyplanText}>
            <span className={styles.penny}>Penny</span>
            <span className={styles.plan}>PLAN</span>
          </Link>

          {/* Navigation Buttons */}
          <div className={styles.authButtons}>
            {!isAuthenticated ? (
              <>
                <Link to="/signup" className={`${styles.authButton} ${styles.signupButton}`}>
                  Sign Up
                </Link>
                <Link to="/login" className={`${styles.authButton} ${styles.loginButton}`}>
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className={`${styles.authButton} ${styles.logoutButton}`}
              >
                Logout
              </button>
            )}
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <SignUp onAuth={handleAuth} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onAuth={handleAuth} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;