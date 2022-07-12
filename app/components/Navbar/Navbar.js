import React from "react";

// import Icon from "../Icon/Icon";
const Navbar = ({ className, id, children }) => {
  return (
    <nav
      className={`${"navbar" + (className ? `${" " + className}` : "")}`}
      role="navigation"
      aria-label="main navigation"
    >
      {children}
    </nav>
  );
};

export default Navbar;
