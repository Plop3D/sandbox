import React from 'react'

export default class LoginBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = { attentionBoxVisible: true }
    const that = this
    window.closeLoginBox = function() {
      that.setState({ attentionBoxVisible: false })
    }
  }

  render() {
    return <div style={{
      left: '50%',
      position: 'absolute',
      zIndex: 1000,
      fontFamily: 'Arial',
      fontSize: 13
    }}>
      <iframe src="/profile" frameBorder="0"/>
    </div>
  }
}
