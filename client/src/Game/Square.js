import React, { Component } from "react"

export default class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      checked: false
    };
    this.button = React.createRef();
  }

  renderImg = (val) => {
    if (val === null) return;
    return val == 1 ?
      <img src={require('./../assets/img/o.svg')} className='squareImg' alt=""/> :
      <img src={require('./../assets/img/x.svg')} className='squareImg' alt=""/>
  }

  _doCheck = () => {
    if (this.state.checked === true) return;
    let { handler, row, col } = this.props;
    let turn = handler(row, col);
    this.setState({
      value: turn,
      checked: true
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.value != this.state.value);
  }

  render() {
    return (
      <button
        className={"square" + (this.state.checked ? " checked" : "")}
        onClick={this._doCheck}
      >
        {this.renderImg(this.state.value)}
      </button>
    );
  }
}