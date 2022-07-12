import React from 'react'
import Icon from "../Icon/Icon";
import "./select.scss";

const Select = ({
  className,
  name,
  leftIcon,
  id,
  options,
  value,
  onChange,
  onClick,
  formatMessage,
  defaultValue,
  style={},
  disabled=false,
  priorityDefault
}) => {

   return (
    <div className={"select " + (className ? " " + className : "")}>
     {leftIcon && <Icon icon={leftIcon} onClick={onClick}/>}
      <select name={name ? name : ""} id={id ? id : ""} value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled} style={style}>
        {!priorityDefault&&
        <option  value="" selected ></option>}
        {
          options && Array.isArray(options) && options.length && options.map(option => {
            return (
              <option key={option.value} value={option.value}> {formatMessage({id: option.displayName})}</option>
            )
          })
        }
      </select>

    </div>
   )
}

export default Select;