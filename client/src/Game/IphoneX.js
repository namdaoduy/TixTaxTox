import React, { Component } from "react"

export default class IphoneX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 30,
    }
  }

  renderImg = (val) => {
    if (val === null) return;
    return val == 1 ?
      <img src={require('./../assets/img/o.svg')} className='ipxImg' alt='' /> :
      <img src={require('./../assets/img/x.svg')} className='ipxImg' alt='' />
  }

  renderTime = () => {
    setInterval(() => {
      let time = Math.round((this.props.game.state.turnstart - Date.now()) / 1000) + 30;
      this.setState({timer: time})
    }, 1000);
  }

  vibrate = () => {
    if (this.state.timer < 10) {
      return " vibrate"
    }
    return ""
  }

  componentDidMount() {
    this.renderTime();
  }

  render() {
    return(
      <div className={'ipx-container' + this.vibrate()}>
        <div className='ipx-screen'>
          <h3>{this.props.game.myturn == this.props.game.state.turn ?
            'Your Turn' : 'Opponent\'s Turn'}</h3>
          {this.renderImg(this.props.game.state.turn)}
          <h2 
            className='ipx-time' 
            style={{color: this.state.timer < 10 ? 'red' : 'black'}}>
            {this.state.timer < 0 ? 0 : this.state.timer}
          </h2>
        </div>
        <div className='ipx-bezel'></div>
      </div>
    )
  }
}