import React from "react";

const NavbarDropdown = ({ className, id, children }) => {
  return (
    <div
      className={`${"navbar-dropdown" +
        (className ? `${" " + className}` : "")}`}
      id={id}
    >
      {children}
    </div>
  );
};

export default NavbarDropdown;
