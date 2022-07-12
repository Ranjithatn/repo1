import React from 'react'
import Icon from '../Icon/Icon';

const Dropdown = ({
  text,
  icon,
  children,
  hover = true,
  onClick = () => {},
}) => {
   return (
    <div className={`dropdown ${ hover ? "is-hoverable" : "" }`}   onClick={ e => { onClick && onClick(e)} } >
      <div className="dropdown-trigger">
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu4">
        { icon && <Icon icon={icon} /> }
          <span>{ text }</span>
          <span className="icon is-small">
            <i className="fa fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" role="menu" style={{zIndex:55}}>
        <div className="dropdown-content">
          { children }
        </div>
      </div>
    </div>
   )
}

export default Dropdown;
