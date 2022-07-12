import React from 'react'

const Title = ({
  text,
  type,
  className,
  is,
  as: Hn,
  ...props
}) => {
  return <Hn className={`title is-${is}`} {...props}>{ text }</Hn>;
}

Title.defaultProps = {
  as: 'h1',
  is: '1'
}

export default Title;
