import React, { Component } from "react"
import Square from './Square'
import { makeArray, makeRefsArray } from './../helpers/helper'

const size = 20;

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cord: null,
    }
    this.data = makeArray(size, size, null);
    this.socket = this.props.socket;
    this.square = makeRefsArray(size, size);
  }

  renderRow = (row) => {
    return Array.apply(null, Array(size)).map((v, col) => { 
      return <Square ref={this.square[row][col]}
        key={col} row={row} col={col}
        handler={this.doCheck.bind(this)}/>
    })
  }

  renderBoard = () => {
    return Array.apply(null, Array(size)).map((v, row) => {
      return <div key={row} className="board-row"> {this.renderRow(row)} </div>
    })
  }

  doCheck = (row, col) => {
    this.props.game.sendCheck(row, col);
    let { turn, movecount } = this.props.game.state;
    this.data[row][col] = turn;
    this.checkWin(row, col, turn);
    this.props.game.setState({ 
      movecount: movecount + 1,
      turn: turn ? 0 : 1,
      turnstart: Date.now(),
    });
    return turn;
  }

  checkWin = (row, col, val) => {
    let data = this.data;
    var count, i, j;

    count = 1;
    j = col;
    while (++j < size) {
      if (data[row][j] == val) count++;
      else if (data[row][j] == !val) { count-= 0.3; break; }
      else break;
    }
    j = col;
    while (--j >= 0) {
      if (data[row][j] == val) count++;
      else if (data[row][j] == !val) { count-= 0.3; break; }
      else break;
    }
    if (Math.round(count) >= 5) return this.props.win(val);

    count = 1;
    i = row;
    while (++i < size) {
      if (data[i][col] == val) count++;
      else if (data[i][col] == !val) { count-= 0.3; break; }
      else break;
    }
    i = row;
    while (--i >= 0) {
      if (data[i][col] == val) count++;
      else if (data[i][col] == !val) { count-= 0.3; break; }
      else break;
    }
    if (Math.round(count) >= 5) return this.props.win(val);

    count = 1;
    i = row;
    j = col;
    while (++i < size && ++j < size) {
      if (data[i][j] == val) count++;
      else if (data[i][j] == !val) { count-= 0.3; break; }
      else break;
    }
    i = row;
    j = col;
    while (--i >= 0 && --j >= 0) {
      if (data[i][j] == val) count++;
      else if (data[i][j] == !val) { count-= 0.3; break; }
      else break;
    }
    if (Math.round(count) >= 5) return this.props.win(val);

    count = 1;
    i = row;
    j = col;
    while (++i < size && --j >= 0) {
      if (data[i][j] == val) count++;
      else if (data[i][j] == !val) { count-= 0.3; break; }
      else break;
    }
    i = row;
    j = col;
    while (--i >= 0 && ++j < size) {
      if (data[i][j] == val) count++;
      else if (data[i][j] == !val) { count-= 0.3; break; }
      else break;
    }
    if (Math.round(count) >= 5) return this.props.win(val);
  }

  componentDidMount() {
    this.socket.on('check pliz', (cord) => {
      this.setState({cord: cord})
    })
  }

  componentDidUpdate() {
    if (this.state.cord) {
      let {row, col} = this.state.cord;
      this.square[row][col].current._doCheck();
      this.setState({ cord:  null})
    }
  }

  disableBoard = () => {
    if (this.props.game.state.turn != this.props.game.state.myturn) {
      return " disable"
    }
    return ""
  }

  render() {
    return (
      <div className={"board" + this.disableBoard()}>
        {this.renderBoard()}
      </div>
    );
  }
}