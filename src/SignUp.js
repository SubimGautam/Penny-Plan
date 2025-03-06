import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css"; // Using your original SignUp.module.css
import image from "./Assets/image.png";
import googleLogo from "./Assets/google.png";

const Signup = ({ onAuth }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Call onAuth with user data
      onAuth(data.user);
      
      // Navigate to dashboard
      navigate("/dashboard");
      
      // Reset form fields
      setUsername('');
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className={styles["main-container"]}>
      <div className={styles["image-container"]}>
        <img src={image} alt="Signup Visual" />
      </div>
      <div className={styles["form-container"]}>
        <div className={styles.header}>
          <h1>Sign Up</h1>
        </div>
        <button className={styles["google-auth"]}>
          <img src={googleLogo} alt="Google Logo" />
          Sign Up with Google
        </button>
        <div className={styles["or-separator"]}>OR</div>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles["form-group"]}>

            <input 
              type="text" 
              name="username" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className={styles["form-group"]}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
              />
              </div>

              <div className={styles["form-group"]}>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
          <button type="submit" className={styles["signup-btn"]}>
            Sign Up
          </button>
        </form>
        <p className={styles["footer-text"]}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;