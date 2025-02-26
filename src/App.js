import React, { useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import styles from "./App.module.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleAuth = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

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