import React from 'react'

function ProgressBar({ value, max, type }) {
   return (
    <progress className={"progress " + type} value={value} max={max}></progress>
   )
}

ProgressBar.defaultProps = {
  max: "100",
  type: "is-primary"
}

export default ProgressBar;
