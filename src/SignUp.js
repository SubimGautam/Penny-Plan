import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SignUp.module.css"; // Ensure filename matches
import image from "./Assets/image.png"; // Ensure image exists in this folder
import googleLogo from "./Assets/google.png";


const Signup = ({ onAuth }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        onAuth();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.error || "Something went wrong");
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
          <div className={styles["form-group"]}>
            <label>Username</label>
            <input type="text" name="username" required />
          </div>
          <div className={styles["form-group"]}>
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className={styles["form-group"]}>
            <label>Password</label>
            <input type="password" name="password" required />
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