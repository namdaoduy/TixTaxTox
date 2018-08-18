import React, { Component } from "react"

export default class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  renderImg = (val) => {
    if (val === null) return;
    return val == 1 ?
      <img src={require('./../assets/img/o.svg')} className='squareImg' /> :
      <img src={require('./../assets/img/x.svg')} className='squareImg' />
  }

  _doCheck = () => {
    if (this.state.value != null) return;
    let { handler, row, col } = this.props;
    let turn = handler(row, col);
    this.setState({value: turn});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.value != this.state.value);
  }

  render() {
    return (
      <button
        className="square"
        onClick={this._doCheck}
      >
        {this.renderImg(this.state.value)}
      </button>
    );
  }
}