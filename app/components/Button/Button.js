import React, { Fragment } from "react";
import Icon from "../Icon/Icon";

const Button = ({
  leftIcon,
  rightIcon,
  text,
  onClick,
  className,
  disabled = false,
  id,
  type = "button",
  style={},
}) => {
  return (
    <button
      id={id}
      type={type}
      className={"button" + (className !== undefined ? " " + className : "")}
      disabled={disabled}
      onClick={onClick}
      style={ style }
    >
      {leftIcon && <Icon icon={leftIcon} />}
      { text &&<span>{text}</span> }
      {rightIcon && <Icon icon={rightIcon} />}
    </button>
  );
};

export default Button;
