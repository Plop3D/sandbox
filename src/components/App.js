import React from 'react'
import {injectGlobal} from 'styled-components'
import {
  Lights,
  Sky,
  VRScene,
  LeftController,
  RightController,
  Fingers,
  Camera
} from 'components'
import {AttentionBox, SettingsPanel} from 'containers'

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
        }}/>
        <VRScene>
          <LeftController />
          <RightController />
          <Sky />
          <Lights />
          <Plane />
          <Camera>
            <Fingers/>
          </Camera>
        </VRScene>
      </div>
    )
  }
}

export default App
