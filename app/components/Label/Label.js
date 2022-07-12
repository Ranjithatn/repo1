import React from 'react'

const Label = ({
  htmlFor,
  text,
  name,
  style={},
  disabled=false,
}) => {
  let disabledStyle = {};
  if ( disabled ) { disabledStyle = { color: "rgba(0,0,0,0.45)" }; }
   return (
    <label className="label" htmlFor={htmlFor ? htmlFor : ""} name={name ? name : ""} style={{...style, ...disabledStyle}}>
      { text }
    </label>
   )
}

export default Label;
