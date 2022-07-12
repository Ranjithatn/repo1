import React from 'react'

function Figure({ is, src }) {
   return (
    <figure className={"image is-" + is}>
      <img src={src} />
    </figure>
   )
}

export default Figure;
