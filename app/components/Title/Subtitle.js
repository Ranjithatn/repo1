import React from 'react'

const Subtitle = ({
  text,
  type,
  className,
  is,
  as: Hn,
  ...props
}) => {
  return <Hn className={`subtitle is-${is}`} {...props}>{ text }</Hn>;
}

Subtitle.defaultProps = {
  as: 'h1',
  is: '1'
}

export default Subtitle;
