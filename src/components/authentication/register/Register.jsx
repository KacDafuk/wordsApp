import { addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/ContextAuth";
import "./register.scss";
const Login = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState(false);
  const { register, addUserToCol } = useAuth();
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    //add check whether nickname already exists
    e.preventDefault();
    if (password != repeatPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      let {
        user: { uid },
      } = await register(email, password);
      setTimeout(() => navigate("/words"), 10); //takes user to correct route after firebase automatic login when user's registers
      addUserToCol(uid);
    } catch (e) {
      console.log(e.message);
      setError("registration failed, try again");
    }
  };
  return (
    <form action="" className="auth-form">
      <label htmlFor="nickname">
        <span>Nickname</span>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </label>
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
      <label htmlFor="repeatPassword">
        {" "}
        <span>Repeat Password</span>
        <input
          type="password"
          id="repeatPassword"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="auth-form__submit"
        onClick={handleRegister}
      >
        Register
      </button>
      <p style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>
        {error ? error : ""}
      </p>
      <p style={{ color: "green", fontWeight: "bold", fontSize: "1.5rem" }}>
        {sucess ? "registered successfully" : ""}
      </p>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Login;
