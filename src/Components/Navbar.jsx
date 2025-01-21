import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const excludedPaths = ["/login", "/register", "/"];

  // Retrieve user from localStorage (with fallback to null if not found)
  const user = JSON.parse(localStorage.getItem("user")) || null;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Clear browser cache
  };
  
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar">
      <h1 className="app-title">SOS Helper</h1>
      <div className="nav-links">
        {location.pathname === "/dashboard" && <Link to="/home">Home</Link>}
        {location.pathname === "/home" && <Link to="/dashboard">Dashboard</Link>}
        {user && (
          <div className="user-menu">
            <span>{user.name}</span>
            <div className="dropdown">
              <button className="logout-button"onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
