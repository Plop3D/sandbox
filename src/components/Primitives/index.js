import React from 'react'
import { Entity } from 'aframe-react'

const Primitives = (props) => {
  return (
    <Entity>
      <Entity primitive='a-box' color='#06c' opacity='0.5' position='-2 1 -2' width='0.6' height='0.6' depth='0.6' />
      <Entity primitive='a-cylinder' color='#06c' opacity='0.5' position='-1 1 -2' height='0.8' radius='0.4' />
      <Entity primitive='a-sphere' color='#06c' opacity='0.5' position='0 1 -2' radius='0.5' />
      <Entity primitive='a-cone' color='#06c' opacity='0.5' position='1 1 -2' radius-bottom='0.5' radius-top='0' height='1' />
      <Entity primitive='a-torus' color='#06c' opacity='0.5' position='2 1 -2' radius='0.4' radius-tubular='0.1' />
    </Entity>
  )
}

export default Primitives
