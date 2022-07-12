import React from "react";
import "./style.scss";

const Icon = ({ icon, title, onClick, disabled=false, style={} }) => {
  return (
    <span
      className={ disabled ? "icon fa-disabled" : "icon" }
      title={title ? title : ""}
      style={style}
      onClick={(e) => typeof onClick === "function" && onClick(e)}
      disabled={ disabled }
    >
      <i className={"fa fa-" + icon} />
    </span>
  );
};

export default Icon;
