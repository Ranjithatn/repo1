import React from "react";

const NavbarLink = ({ className, id, children }) => {
  return (
    <div
      className={`${"navbar-link" + (className ? `${" " + className}` : "")}`}
    >
      {children}
    </div>
  );
};

export default NavbarLink;
