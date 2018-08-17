import React, { Component } from "react"

export default class IphoneX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
    }
  }

  renderImg = (val) => {
    if (val === null) return;
    return val == 1 ?
      <img src={require('./../assets/img/o.svg')} className='ipxImg' /> :
      <img src={require('./../assets/img/x.svg')} className='ipxImg' />
  }

  renderTime = () => {
    let time = Math.round((this.props.game.state.turnstart + 30 - Date.now()) / 1000);
    setInterval(() => {
      this.setState({timer: time--})
    }, 1000);
  }

  componentDidMount() {
    this.renderTime();
  }

  render() {
    return(
      <div className='ipx-container'>
        <div className='ipx-screen'>
          <h3>{this.props.game.state.myturn == this.props.game.state.turn ?
            'Your Turn' : 'Opponent\'s Turn'}</h3>
          {this.renderImg(this.props.game.state.turn)}
          <h2 className='time'>
            {this.state.timer}
          </h2>
        </div>
        <div className='ipx-bezel'></div>
      </div>
    )
  }
}