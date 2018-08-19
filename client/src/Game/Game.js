import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { AwesomeButton } from 'react-awesome-button';
import Board from './Board'
import IphoneX from './IphoneX'
import Chat from './Chat'
import './GameCSS.css'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      started: false,
      ended: false,
      overlayText: 'READY',
      message: 'hi',
      shrink: ' hide',
      messType: ' send',
      turn: 1,
      movecount: 0,
      myturn: this.props.location.state ? this.props.location.state.turn : -1,
      turnstart: Date.now(),
    }
    this.starttime = Date.now();
    this.winner = false;
    this.timeout = null;
    this.socket = this.props.socket;
    this.rkey = this.props.location.state ? this.props.location.state.rkey : '';
  }

  startGame = (time) => {
    this.setState({
      started: true,
      turnstart: time
    })
  }

  sendCheck(row, col) {
    if (this.state.turn != this.state.myturn) return;
    this.socket.emit('check', {row: row, col: col});
  }

  sendMessage = (text) => {
    this.socket.emit('message', text);
    this.displayMessage(true, text);
  }

  displayMessage = (me, text) => {
    var messType;
    clearTimeout(this.timeout);
    if (me)
      messType = ' send';
    else
      messType = ' receive';
    this.setState({
      message: text,
      messType: messType,
      shrink: '',
    })
    this.timeout = setTimeout(() => { this.setState({message: '', shrink: ' hide'}) }, 5000);
  }

  win = (result) => {
    this.removeAll();
    this.setState({
      overlayText: result == this.state.myturn ? "YOU WIN" : "YOU LOSE",
      started: false,
    });
    this.winner = (result == this.state.myturn);
    setTimeout(() => {
      this.setState({ended: true})
    }, 2000)
  }

  onResult = () => {
    this.socket.disconnect();
    this.setState({
      loaded: false,
    })
    setTimeout(() => {
      this.props.history.replace({
        pathname: '/end',
        state: { 
          win: this.winner,
          movecount: this.state.movecount,
          time: Math.round((Date.now() - this.starttime) / 1000),
          gofirst: this.state.myturn,
        } 
      });
    }, 1000)
  }

  removeAll = () => {
    var events = ['reconnect','start','timeup','message to','player disconnect'];
    for (var e of events) {
      this.socket.removeAllListeners(e);
    }
  }

  listener = () => {
    this.removeAll();

    this.socket.on('start', (time) => {
      this.startGame(time);
    })

    this.socket.on('timeup', () => {
      this.setState({
        turn: this.state.turn ? 0 : 1,
        turnstart: Date.now(),
      })
    })

    this.socket.on('message to', (text) => {
      this.displayMessage(false, text);
    })

    this.socket.on('player disconnect', () => {
      this.setState({
        overlayText: "PLAYER 2 QUIT",
        started: false,
      })
      setTimeout(() => {
        //this.props.history.push('/');
        this.win(this.state.myturn)
      }, 3000);
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loaded: true})
    }, 1000);

    this.listener();
  }

  render() {
    if (!this.props.location.state || this.props.history.action != 'REPLACE') 
      return( <Redirect to='/' />)
    else
      return(
        <div className={'board-container' + (this.state.loaded ? ' loaded' : '')}>
          <IphoneX game={this} />
          <Board game={this} win={this.win.bind(this)} socket={this.socket} rkey={this.rkey}/>
          <Chat send={this.sendMessage}/>
          <div 
            className={"message-container" + this.state.shrink + this.state.messType}>
            {this.state.message}
          </div>
          <div 
            className={this.state.started ? "overlay hide" : "overlay"}>
            <h1 className="overlay-text">{this.state.overlayText}</h1>
          </div>
          <div 
            className={"btn-result" + (this.state.ended ? '' : ' hide')}>
            <AwesomeButton
              action={this.onResult}
              size="large" type="primary" bubbles={true}>
              RESULT
            </AwesomeButton>
          </div>
          <div id="loader-wrapper">
            <div className="loader-section section-left"></div>
            <div className="loader-section section-right"></div>
          </div>
        </div>
      )
  }
}