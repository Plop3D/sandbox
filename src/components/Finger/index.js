import React from 'react'
import {Entity} from "aframe-react";

export default class Finger extends React.Component {
  render() {
    return <Entity
      geometry="primitive: sphere;"
      radius="0.1"
      material={"color: " + this.props.color}
      position={this.props.position}/>
  }
}
