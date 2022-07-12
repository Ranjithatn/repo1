import React from "react";

export default function Note() {
  return (
    <div className="note">
      <Label text="Notes" />
      <Textarea rows="3" />
    </div>
  )
}