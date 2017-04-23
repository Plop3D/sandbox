/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  attentionBoxVisible: PropTypes.bool,
  toggleAttentionBox: PropTypes.func,
}

const AttentionBox = ({ attentionBoxVisible, toggleAttentionBox }) => {
  return (
    <div style={{ left: '50%', position: 'absolute', zIndex: 1000, display: attentionBoxVisible ? 'block' : 'none', fontFamily: 'Arial', fontSize: 13 }}>
      <div style={{ background: 'rgba(0, 0, 0, 0.85)', position: 'relative', left: '-50%', width: 270, padding: 20, margin: 20 }}>
        <span style={{ color: '#fff', textAlign: 'right', right: 10 }}>
          <a href="#" onClick={toggleAttentionBox} style={{ color: '#81d1ef' }}>Close [x]</a>
        </span>
        <h3 style={{ color: '#fff', margin: '0 auto', textAlign: 'center', marginTop: 10 }}>Plop3D</h3>

        <blockquote style={{ color: '#fff', margin: '0 auto', textAlign: 'center', marginTop: 10 }}>
          "I am convinced that the best learning takes place when the learner takes charge." <br />
          <span style={{ fontStyle: 'italic' }}>- Seymour Papert</span>
        </blockquote>

        <p style={{ color: '#fff', margin: '0 auto', textAlign: 'center', marginTop: 10 }}>
          This project is designed for HTC Vive with controllers.
          Vive support currently only works in newest, experimental versions of Chromium and Firefox Nightly browsers.
          For more information check <a href="https://webvr.info/" target="_blank" style={{ color: '#81d1ef' }}>https://webvr.info/</a>.
        </p>
      </div>
    </div>
  )
}

AttentionBox.propTypes = propTypes
export default AttentionBox
