import React from 'react'
import {Entity} from "aframe-react";

class Shape extends React.Component {
  constructor(props, numberOfShapes) {
    super(props)
    this.key = Date.now() + '-' + numberOfShapes
    this.state = {
      x: props.position.x,
      y: props.position.y,
      z: props.position.z,
    }
  }

  move(fingerPos, fingerPrevPos){
    this.setState({
      x: this.state.x + (fingerPos.x - fingerPrevPos.x),
      y: this.state.y + (fingerPos.y - fingerPrevPos.y),
      z: this.state.z + (fingerPos.z - fingerPrevPos.z),
    })
  }

  wasMounted(){
    return true
  }

  render() {
    return <Entity key={this.key}
      position={{x: this.state.x, y: this.state.y, z: this.state.z}}
      {...this.props}/>
  }
}

class Shapes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfShapes: 0,
    }
    this.shapes = []
  }

  addShape(primitive) {
    let shape = new Shape(primitive.props)
    this.shapes.push(shape)
    this.state.numberOfShapes += 1
    this.setState(this.state)
    return shape
  }

  getShapes() {
    return this.shapes;
  }

  render() {
    const shapes = this.shapes.map(shape => {
      return shape.render()
    })
    return (
      <Entity>
        {shapes}
      </Entity>
    )
  }
}

export default Shapes
