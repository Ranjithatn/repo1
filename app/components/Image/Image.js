import React, { Fragment } from "react";

const Image = ({ className, id, alt, src, width, height, onClick, title, style={} }) => {
  return (
    <img
      onClick={onClick}
      id={id}
      title={title}
      className={"img" + (className !== undefined ? " " + className : "")}
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
    />
  );
};

export default Image;
