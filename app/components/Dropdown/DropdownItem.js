import React from 'react'
import Icon from '../Icon/Icon';

const DropdownItem = ({
  className,
  text,
  leftIcon,
  rightIcon,
  onClick,
  disabled=false,
}) => {
   return (
    <div className={"dropdown-item" + (className ? " " + className : "")} style={ disabled ? { pointerEvents: "none", color: '#CCC' } : {zIndex:65} } onClick={onClick}>
      { leftIcon && <Icon icon={leftIcon} />}
      { text }
      { rightIcon && <Icon icon={rightIcon} />}
    </div>
   )
}

export default DropdownItem;
