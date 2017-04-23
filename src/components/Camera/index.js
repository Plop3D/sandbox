import React from 'react'
import {Entity} from 'aframe-react'
import GamepadControls from 'aframe-gamepad-controls'

class Camera extends React.Component {
  render() {
    return (
      <Entity
        ref={(camera) => {this.camera = camera}}
        gamepad-controls
        camera
        position="0 1.6 0"
        data-aframe-default-camera
        wasd-controls
        rotation
        look-controls
        aframe-injected
        scale
        visible>
        {this.props.children}
      </Entity>
    )
  }
}

export default Camera
