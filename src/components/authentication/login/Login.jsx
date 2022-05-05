import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/ContextAuth";
import "./login.scss";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  alert("git new teasdasst :)");
  const handleLogin = async (e) => {
    //add check whether nickname already exists
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/words");
    } catch (e) {
      console.log(e.message);
      setError("login failed, try again");
    }
  };
  return (
    <form action="" className="auth-form">
      <label htmlFor="email">
        <span>Email</span>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label htmlFor="password">
        <span>Password</span>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit" className="auth-form__submit" onClick={handleLogin}>
        Login
      </button>
      <p style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>
        {error ? error : ""}
      </p>
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot password? <Link to="/reset">Reset Password</Link>
      </p>
    </form>
  );
};

export default Login;
