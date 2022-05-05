import { useAuth } from "../../context/ContextAuth";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";
const Navbar = () => {
  const { logout } = useAuth();
  return (
    <nav className={styles.nav}>
      <Link to="/words">words</Link>
      <Link to="/randomword">wylosuj słowo</Link>
      <Link to="/quiz">quiz</Link>
      <Link to="/wordsattack">atak słów</Link>
      <Link to="/whackword">whack a word</Link>
      <Link onClick={logout} to="/login">
        wyloguj
      </Link>
    </nav>
  );
};

export default Navbar;
