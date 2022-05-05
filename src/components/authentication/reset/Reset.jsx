import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/ContextAuth";
import "./reset.scss";
const Reset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState(false);
  const { reset } = useAuth();
  async function handleReset(e) {
    e.preventDefault();
    try {
      await reset;
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 1500);
    } catch (e) {
      setError("reset failed");
    }
  }
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

      <button type="submit" className="auth-form__submit" onClick={handleReset}>
        Reset Password
      </button>
      <p style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>
        {error ? error : ""}
      </p>
      <p style={{ color: "green", fontWeight: "bold", fontSize: "1.5rem" }}>
        {sucess ? "check your inbox :)" : ""}
      </p>
      <p>
        Go back to <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Reset;
