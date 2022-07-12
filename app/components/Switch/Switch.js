import React from "react";

const Switch = ({ id, disabled = false, checked, text, className, value, onChange, name }) => {
  return (
    <div className="field">
      <input
        id={id ? id : ""}
        type="checkbox"
        onChange={onChange}
        disabled={disabled}
        value={value}
        name={id ? id : ""}
        className={"switch" + (className ? " " + className : "")}
        checked={checked}
      />
     <label  htmlFor={id ? id : ""}>{text}</label>
    </div>
  );
};

export default Switch;
