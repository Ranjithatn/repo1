import React from "react";
import Icon from "../Icon/Icon";

const Input = ({
  onChange,
  value,
  id,
  placeholder,
  name,
  type,
  maxLength,
  minLength,
  disabled = false,
  defaultValue,
  defaultChecked,
  className,
  style={},
  wrapperStyle={},
  onKeyPress,
  leftIcon,
  rightIcon,
  onClick,
  close,
  search
}) => {
  return (
    <div className="control" style={ wrapperStyle }>
    {leftIcon && <Icon icon={leftIcon} onClick={close}/>}
      <input
        id={id}
        className={className}
        name={name}
        type={type || "text"}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        defaultValue={defaultValue}
        defaultChecked={defaultChecked}
        style={style}
        onKeyPress={ onKeyPress ? onKeyPress : () => {} }
      />
      {rightIcon && <Icon icon={rightIcon} onClick={search}/>}
    </div>
  );
};

export default Input;
