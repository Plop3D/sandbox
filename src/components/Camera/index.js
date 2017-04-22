import React from 'react'
import { Entity } from 'aframe-react'
import GamepadControls from 'aframe-gamepad-controls'

const Camera = (props) => {
  return (
    <Entity
	  gamepad-controls
	  camera
	  position="0 1.6 0" 
	  data-aframe-default-camera 
	  wasd-controls 
	  rotation
	  look-controls 
	  aframe-injected 
	  scale 
	  visible

	  {...props} />
  )
}

export default Camera
