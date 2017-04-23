import React from 'react'
import {injectGlobal} from 'styled-components'
import {
  Lights,
  Sky,
  VRScene,
  LeftController,
  RightController,
  Plane,
  Finger
} from 'components'
import {AttentionBox, Calculator, FunctionBox, ParametricFunction, SettingsPanel} from 'containers'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fingers: {
        "left-index-finger": { color: '#ee0', position: '0 0 0' },
        "left-index-thumb": { color: '#282', position: '0 0 0' },
        "right-index-finger": { color: '#12c', position: '0 0 0' },
        "right-index-thumb": { color: '#12c', position: '0 0 0' },
      }
    }

    let that = this
    window.moveFinger = function(data) {
      let fingers = {}
      fingers[data.id] = { position: data.x + ' ' + data.y + ' ' + data.z }
      that.setState({ fingers: fingers })
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
    let fingers = []
    for (let fingerName in this.state.fingers) {
      let finger = this.state.fingers[fingerName]
      fingers.push(<Finger
        key={fingerName}
        color={finger.color}
        position={finger.position}/>)
    }
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
          <AttentionBox />
          <LeftController />
          <RightController />

          <FunctionBox>
            { /* Function mesh with grid */ }
            <ParametricFunction />
          </FunctionBox>

          <Calculator />

          <SettingsPanel
            name="Function settings"
            position={{ x: -0.37, y: 1.93, z: -0.34 }}
            rotation={{ x: 10, y: 30, z: 0 }}
            scale={{ x: 0.5, y: 0.5, z: 0.5 }}
          />

          <Sky />
          <Lights />
          <Plane />

          {fingers}
        </VRScene>
      </div>
    )
  }
}

export default App
