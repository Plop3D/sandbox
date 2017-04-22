import React from 'react';

export default class Video extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <video id="video"/>
                <canvas id="canvas"/>
            </div>
        );
    }
}