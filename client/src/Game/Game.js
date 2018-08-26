import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { AwesomeButton, AwesomeButtonProgress } from 'react-awesome-button';
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
      player2quit: false,
      overlayText: 'READY',
      message: 'hi',
      shrink: ' hide',
      messType: ' send',
      turn: 1,
      movecount: 0,
      turnstart: Date.now(),
    }
    this.myturn = this.props.location.state ? this.props.location.state.turn : -1;
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
    if (this.state.turn != this.myturn) return;
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

    this.socket.on('player disconnect', () => {
      this.setState({player2quit: true});
    })

    this.setState({
      overlayText: result == this.myturn ? "YOU WIN" : "YOU LOSE",
      started: false,
    });
    this.winner = (result == this.myturn);
    this.starttime = Math.round((Date.now() - this.starttime) / 1000);
    setTimeout(() => { this.setState({ended: true}) }, 2000);
  }

  onResult = () => {
    this.removeAll();
    this.socket.emit('end game');
    this.setState({
      loaded: false,
    })
    setTimeout(() => {
      this.props.history.replace({
        pathname: '/end',
        state: { 
          win: this.winner,
          movecount: this.state.movecount,
          time: this.starttime,
          gofirst: this.myturn,
        } 
      });
    }, 1000)
  }

  onRematch = (el, next) => {
    this.socket.on('turn', (turn) => {
      this.setState({ turn: turn })
    })

    this.socket.on('rematch', () => {
      this.removeAll();
      next();
      this.setState({ loaded: false }, () => {
        setTimeout(() => {
          this.props.history.replace({
            pathname: '/game',
            state: { rkey: this.rkey, turn: this.state.turn } 
          });
        }, 1000)
      })
    })

    this.socket.emit('rematch');
  }

  removeAll = () => {
    var events = ['reconnect','start','timeup','message to','player disconnect','turn','rematch'];
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
        this.win(this.myturn)
      }, 3000);
    })
  }

  componentDidMount() {
    console.log(this);
    setTimeout(() => {
      this.setState({loaded: true})
    }, 1000);

    this.listener();
  }

  render() {
    if (!this.props.location.state || this.props.history.action == 'POP') 
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
            <AwesomeButtonProgress
              action={(el, next) => this.onRematch(el, next)}
              loadingLabel="Waiting ..."	
              resultLabel="BEAT HIM!"
              size="medium" type="secondary">
              REMATCH!
            </AwesomeButtonProgress>
            <AwesomeButton
              action={this.onResult}
              size="icon" type="primary" bubbles={true}>
              >
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