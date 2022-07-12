import React, { Fragment } from "react";
import Icon from "../Icon/Icon";
import "./FileBrowser.scss";

const FileBrowser = ({
  leftIcon,
  rightIcon,
  text,
  onClick,
  onChange,
  ref,
  className,
  fileStyle,
}) => {
  return (
    <div className="fileUpload button is-primary is-medium">
      {leftIcon && <Icon icon={leftIcon} />}
      <span>{text}</span>
      {rightIcon && <Icon icon={rightIcon} />}
      <input id="myInput"
        type="file"
        className={"upload" + (className !== undefined ? " " + className : "")}
        ref={ref}
        onChange={onChange}
        onClick={onClick}
        style={fileStyle || {}}
      />
    </div>
  );
};

export default FileBrowser;
