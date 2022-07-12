import React from "react";

const Textarea = ({
  id,
  className,
  value,
  onChange,
  cols,
  rows,
  disabled = false
}) => {
  return (
    // <div className="field">
    //   <div className="control">
    <textarea
      className={"textarea" + (className ? " " + className : "")}
      id={id ? id : ""}
      cols={cols ? cols : 30}
      rows={rows ? rows : 5}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
    //   </div>
    // </div>
  );
};

export default Textarea;
