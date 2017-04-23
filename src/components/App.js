import React from 'react'
import ReactDOM from 'react-dom'
import {injectGlobal} from 'styled-components'
import {
  Lights,
  Sky,
  VRScene,
  LeftController,
  RightController,
  Fingers,
  Camera,
  Primitives,
  LoginBox,
  Shapes
} from 'components'

class App extends React.Component {
  constructor(props) {
    super(props)

    window.emit = (type, data) => {
      if (type === 'grab:start') {
        this.lastGrab = data

        // Fingers are positioned inside camera and we need to adjust a finger
        // Coordinate to the world
        var cameraNode = ReactDOM.findDOMNode(this.refs.camera)
        const point = cameraNode.object3D
          .localToWorld(new THREE.Vector3(data.x, data.y, data.z))

        // Go over all shapes and check if the grab happenned inside one of them
        // We check shapes first to allow them to move away from the primitives
        this.refs.shapes.getShapes().forEach((shape) => {
          if (shape.wasMounted()){
            const box = new THREE.Box3().setFromObject(ReactDOM.findDOMNode(shape).object3D)
            if (box.containsPoint(point)){
              this.selectedShape = shape
              return
            }
          }
        })

        // If we grab outside of the shapes, go over primitives and create a
        // Shape and select it for daggin
        this.refs.primitives.getPrimitives().forEach((primitive) => {
          const box = new THREE.Box3().setFromObject(ReactDOM.findDOMNode(primitive).object3D)
          if (box.containsPoint(point)){
            this.selectedShape = this.refs.shapes.addShape(primitive)
            return
          }
        })
      } else if (type === 'grab:end') {
        this.lastGrab = this.selectedShape = null
      } else if (type === 'grab:move') {
        if (this.selectedShape && this.selectedShape.wasMounted()){
          this.selectedShape.move(data, this.lastGrab)
          this.lastGrab = data
        }
      }
    }
  }

  componentDidMount() {
    injectGlobal`
      body {
        margin: 0;
      }
      .a-canvas {
        position: relative;
      }
    `
  }

  render() {
    return (
      <div>
        <iframe src="/video" style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 240 + 'px',
          height: 180 + 'px',
          zIndex: 9999
        }} frameBorder="0"/>
        <VRScene>
          <LoginBox/>
          <LeftController />
          <RightController />
          <Sky />
          <Lights />
          <Camera ref='camera'><Fingers /></Camera>
          <Primitives ref='primitives' />
          <Shapes ref='shapes' />
        </VRScene>
      </div>
    )
  }
}

export default App
