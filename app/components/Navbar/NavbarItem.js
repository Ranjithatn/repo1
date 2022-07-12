import React from "react";

const NavbarItem = ({ className, id, children }) => {
  return (
    <div
      className={`${"navbar-item" + (className ? `${" " + className}` : "")}`}
      id={id}
    >
      {children}
    </div>
  );
};

export default NavbarItem;
