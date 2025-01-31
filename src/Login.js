// import React from 'react';
// import './SignUp.css';
// import loginImage from './Assets/login.png';


// const SignUp = () => {
//   return (
//     <div className="main-container">
//       {/* Left side - Image */}
//       <div className="image-container">
//       <img src={loginImage} alt="PennyPLAN Visual" />
//       </div>

//       {/* Right side - Form */}
//       <div className="form-container">
//         <div className="header">
//           <div className="nav-links">
//           </div>
//         </div>

//         <div className="savings-section">
//           <button className="google-auth">
//             <i className="fab fa-google"></i>
//             Sign in with Google
//           </button>
//           <div className="or-separator">OR</div>
//         </div>

//         <form className="signup-form">
//           <div className="form-group">
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input type="email" placeholder="Enter Email" />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input type="password" placeholder="Enter Password" />
//           </div>

//           <button type="submit" className="signup-btn">Log In</button>
//         </form>

//         <p className="footer-text">
//           Don' have an account? <a href="/login">SignUp</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// src/components/Login/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./Login.css";
import loginImage from "./Assets/login.png";

const Login = ({ onAuth }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login logic (replace with actual API call)
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      // Call the onAuth function to set authentication state
      onAuth();

      // Redirect to the dashboard
      navigate("/dashboard");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="main-container">
      {/* Left side - Image */}
      <div className="image-container">
        <img src={loginImage} alt="PennyPLAN Visual" />
      </div>

      {/* Right side - Form */}
      <div className="form-container">
        <div className="header">
          <div className="nav-links"></div>
        </div>

        <div className="savings-section">
          <button className="google-auth">
            <i className="fab fa-google"></i>
            Login with Google
          </button>
          <div className="or-separator">OR</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter Password" required />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;