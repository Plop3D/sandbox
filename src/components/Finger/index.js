import React from 'react'
import {Entity} from "aframe-react";

class Finger extends React.Component {
  render() {
    return <Entity
      id={this.props.id}
      geometry={{ primitive: "sphere", radius: 0.1 }}
      material={{ color: this.props.color }}
      position={{
        x: this.props.position.x,
        y: this.props.position.y,
        z: this.props.position.z
      }}
    />
  }
}

export default class Fingers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fingers: {
        "left-index-finger": { color: '#ee0', position: {} },
        "left-thumb-finger": { color: '#282', position: {} },
        "right-index-finger": { color: '#ee0', position: {} },
        "right-thumb-finger": { color: '#282', position: {} },
      }
    }

    let that = this
    window.moveFinger = function(data) {
      that.state.fingers[data.id].position = { x: data.x, y: data.y, z: data.z }
      that.setState(that.state)
    }
  }

  render() {
    let fingers = []
    for (let fingerName in this.state.fingers) {
      let finger = this.state.fingers[fingerName]
      fingers.push(<Finger
        id={fingerName}
        key={fingerName}
        color={finger.color}
        position={finger.position}/>)
    }
    return <Entity>{fingers}</Entity>
  }
}
