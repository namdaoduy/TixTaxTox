import React, { Component } from "react"
import Board from './Board'
import IphoneX from './IphoneX'
import './GameCSS.css'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 1,
      myturn: 1,
      turnstart: 0,
    }
  }

  startGame = () => {
    this.setState({
      turnstart: Date.now()
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.startGame();
    }, 3000);
  }

  render() {
    return(
      <div className='board-container' disable={!this.state.turnstart}>
        <IphoneX game={this} />
        <Board game={this} />
      </div>
    )
  }
}