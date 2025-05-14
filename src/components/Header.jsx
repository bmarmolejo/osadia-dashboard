import React from "react";
import "../components/Header.scss";
import OsadiaLogo from "../assets/Osadia-Logo.png";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to={"/"} className="header__logo-link">
          <img src={OsadiaLogo} alt="osadia logo" />
        </Link>
      </div>
      <nav className="navigation">
        <NavLink to={"/"} className={"navigation__link"}>
          Inventory
        </NavLink>
        <NavLink to={"/inventory"} className={"navigation__link"}>
          Locations
        </NavLink>
        <NavLink to="/sold" className="navigation__link">
          Sold
        </NavLink>
      </nav>
    </header>
  );
}
export default Header;
