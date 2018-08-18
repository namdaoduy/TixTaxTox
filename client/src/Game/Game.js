import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Board from './Board'
import IphoneX from './IphoneX'
import Chat from './Chat'
import './GameCSS.css'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 1,
      myturn: this.props.location.state ? this.props.location.state.turn : -1,
      turnstart: Date.now(),
    }
    this.socket = this.props.socket;
    this.rkey = this.props.location.state ? this.props.location.state.rkey : '';
  }

  sendCheck(row, col) {
    if (this.state.turn != this.state.myturn) return;
    this.socket.emit('check', {row: row, col: col});
  }

  startGame = (time) => {
    console.log(time);
    this.setState({
      turnstart: time
    })
  }

  sendMessage = (text) => {
    this.socket.emit('message', text);
  }

  componentDidMount() {
    console.log(this.socket.id);
    console.log("mounted")
    this.socket.on('start', (time) => {
      console.log("start");
      console.log(this.socket.id)
      this.startGame(time);
    })

    this.socket.on('timeup', () => {
      this.setState({
        turn: this.state.turn ? 0 : 1,
        turnstart: Date.now(),
      })
    })

    this.socket.on('message', (text) => {
      console.log(text);
    })
  }

  render() {
    if (!this.props.location.state || this.props.history.action != 'REPLACE') 
      return( <Redirect to='/' />)
    else
      return(
        <div className='board-container'>
          <IphoneX game={this} />
          <Board game={this} socket={this.socket} rkey={this.rkey}/>
          <Chat send={this.sendMessage}/>
        </div>
      )
  }
}