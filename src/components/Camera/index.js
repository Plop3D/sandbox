import React from 'react'
import { Entity } from 'aframe-react'

const Camera = (props) => {
  return (
    <Entity camera="" {...props}>
      { props.children }
    </Entity>
  )
}

export default Camera
