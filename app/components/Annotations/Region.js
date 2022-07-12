import React from "react";

export default function Region({
  selectedRegion,
  id,
  className,
  onClick,
  isAnnotated
}) {
  // console.log("Region::selectedRegion, id, isAnnotated, className",selectedRegion, id, isAnnotated, className);
  return (
    <button
      className={
        "region" +
        ((selectedRegion === id && (isAnnotated !== false || isAnnotated !== undefined) ) ? " active" : "") +
        (isAnnotated ? " isAnnotated" : "")
      }
      id={id}
      onClick={onClick}
    />
  );
}
