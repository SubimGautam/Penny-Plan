import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./SignUp.css";
import loginImage from "./Assets/login.png";

const SignUp = ({ onAuth }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (username && email && password) {
      onAuth();
      
      navigate("/dashboard");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="main-container">
    
      <div className="image-container">
        <img src={loginImage} alt="PennyPLAN Visual" />
      </div>

      
      <div className="form-container">
        <div className="header">
          <div className="nav-links"></div>
        </div>

        <div className="savings-section">
          <button className="google-auth">
            <i className="fab fa-google"></i>
            Sign up with Google
          </button>
          <div className="or-separator">OR</div>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="Enter Username" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter Password" required />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
