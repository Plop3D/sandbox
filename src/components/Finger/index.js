import React from 'react'
import {Entity} from "aframe-react";

class Finger extends React.Component {
  render() {
    const radius = window.isMobile ? 0.08 : 0.16
    return <Entity
      id={this.props.id}
      geometry={{ primitive: "sphere", radius: radius }}
      material={{ color: this.props.color }}
      position={{
        x: this.props.position.x,
        y: this.props.position.y,
        z: this.props.position.z
      }}
    />
  }
}

class Hand extends React.Component {
  render() {
    const radius = window.isMobile ? 0.04 : 0.08
    return <Entity
      id={this.props.id}
      geometry={{ primitive: "sphere", radius: radius }}
      material={{ color: "#eee" }}
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
        "left-thumb-finger": { color: '#285', position: {} },
        "right-index-finger": { color: '#ee0', position: {} },
        "right-thumb-finger": { color: '#285', position: {} },
      },
      hands: {
        "left-hand": { position: {} },
        "right-hand": { position: {} }
      }
    }

    let that = this
    window.moveFinger = (data) => {
      that.state.fingers[data.id].position = { x: data.x, y: data.y, z: data.z }
      that.setState(that.state)
    }
    window.moveHand = (data) => {
      that.state.hands[data.id].position = { x: data.x, y: data.y, z: data.z }
      that.setState(that.state)
    }
    window.emit = (type, data) => {
      console.log(type, data)
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
    let hands = []
    for (let handName in this.state.hands) {
      let hand = this.state.hands[handName]
      hands.push(<Hand
        id={handName}
        key={handName}
        position={hand.position}/>)
    }
    return <Entity>{fingers}{hands}</Entity>
  }
}
