import React from 'react'
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
  LoginBox
} from 'components'

class App extends React.Component {
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
          <Camera>
            <Fingers/>
          </Camera>
          <Primitives />
        </VRScene>
      </div>
    )
  }
}

export default App
