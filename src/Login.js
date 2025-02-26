import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import image from './Assets/image.png';
import googleLogo from './Assets/google.png';

const Login = ({ onAuth }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onAuth();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className={styles["main-container"]}>
      <div className={styles["image-container"]}>
        <img src={image} alt="Login Visual" />
      </div>

      <div className={styles["form-container"]}>
        <div className={styles.header}>
          <h1>Login</h1>
        </div>

        <button className={styles["google-auth"]}>
          <img src={googleLogo} alt="Google Logo" />
          <span>Login with Google</span>
        </button>
        <div className={styles["or-separator"]}>OR</div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles["form-group"]}>
            <label>Email</label>
            <input type="email" name="email" required />
          </div>

          <div className={styles["form-group"]}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>

          <button type="submit" className={styles["signup-btn"]}>Login</button>
        </form>

        <p className={styles["footer-text"]}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;