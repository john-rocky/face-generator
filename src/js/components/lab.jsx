import React from 'react';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import { List } from 'immutable';
import { sprintf } from 'sprintf-js';

import Face from './face.jsx';

export default class Lab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            z: List(Array.from(Array(this.props.route.z_dim), () => Math.random() * 2 - 1)),
            face: null
        };
    }
    componentDidMount() {
        this.updateFace();
    }
    updateFace() {
        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.z)
        }).then((response) => {
            return response.json();
        }).then((json) => {
            this.setState({
                face: json.result
            });
        });
    }
    handleChangeSlider(i, e, value) {
        this.setState({
            z: this.state.z.set(i, value)
        }, this.updateFace);
    }
    handleClickButton() {
        this.setState({
            z: List(Array.from(Array(this.props.route.z_dim), () => Math.random() * 2 - 1))
        }, this.updateFace);
    }
    render() {
        const sliders = this.state.z.map((e, i) => {
            return (
                <div key={i}>
                  <Slider
                      value={e}
                      min={-1.0}
                      max={+1.0}
                      axis={'y'}
                      style={{ height: 200, width: 60 }}
                      onChange={this.handleChangeSlider.bind(this, i)} />
                  <p>{sprintf('%.2f', e)}</p>
                </div>
            );
        });
        return (
            <div>
              <div>
                <Face src={this.state.face} />
              </div>
              <div style={{ display: 'flex', height: 250, width: 600, flexDirection: 'row', justifyContent: 'space-around' }}>
                {sliders}
              </div>
              <br />
              <RaisedButton label="random" primary={true} onTouchTap={this.handleClickButton.bind(this)} />
            </div>
        );
    }
}