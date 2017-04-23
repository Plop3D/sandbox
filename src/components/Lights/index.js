import React from 'react'
import { Entity } from 'aframe-react'

const Lights = (props) => {
  return (
    <Entity {...props}>
      <Entity light={{ type: 'ambient', color: '#ccc', intensity: 0.9 }} />
      <Entity light={{ type: 'directional', color: '#fff', intensity: 0.5 }} position={{ x: -0.5, y: 1, z: 1 }} />
      <Entity light={{ type: 'hemisphere,', groundColor: '#888', intensity: 0.8 }} />
    </Entity>
  )
}

export default Lights
