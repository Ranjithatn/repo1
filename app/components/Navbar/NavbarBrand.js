import React from "react";

const NavbarBrand = ({ logo, className, id }) => {
  return (
    <div
      className={`${"navbar-brand" + (className ? `${" " + className}` : "")}`}
      id={id}
    >
      <img src={logo} alt="logo" />
    </div>
  );
};

export default NavbarBrand;
