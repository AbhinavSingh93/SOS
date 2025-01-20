import React from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="app-title">SOS Helper</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
