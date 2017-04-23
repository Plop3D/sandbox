import React from 'react'
import { Entity } from 'aframe-react'

class Primitives extends React.Component {
  constructor(props){
    super(props)
    this.primitives = []
  }

  getPrimitives() {
    return this.primitives
  }

  render() {
    return (
      <Entity>
        <Entity ref={(primitive) => { this.primitives.push(primitive) }} primitive='a-box' color='#06c' opacity='0.5' position='-2 1 -3' width='0.6' height='0.6' depth='0.6' />
        <Entity ref={(primitive) => { this.primitives.push(primitive) }} primitive='a-cylinder' color='#06c' opacity='0.5' position='-1 1 -3' height='0.8' radius='0.4' />
        <Entity ref={(primitive) => { this.primitives.push(primitive) }} primitive='a-sphere' color='#06c' opacity='0.5' position='0 1 -3' radius='0.5' />
        <Entity ref={(primitive) => { this.primitives.push(primitive) }} primitive='a-cone' color='#06c' opacity='0.5' position='1 1 -3' radius-bottom='0.5' radius-top='0' height='1' />
        <Entity ref={(primitive) => { this.primitives.push(primitive) }} primitive='a-torus' color='#06c' opacity='0.5' position='2 1 -3' radius='0.4' radius-tubular='0.1' />
      </Entity>
    )
  }
}

export default Primitives
