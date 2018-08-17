import React, { Component } from "react"
import Square from './Square'
import { makeArray } from './../helpers/helper'

const size = 20;

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: makeArray(size, size, null)
    }
  }

  renderRow = (row) => {
    return Array.apply(null, Array(size)).map((v, col) => { 
      return <Square key={col} row={row} col={col} handler={this.doCheck.bind(this)}/>
    })
  }

  renderBoard = () => {
    return Array.apply(null, Array(size)).map((v, row) => {
      return <div key={row} className="board-row"> {this.renderRow(row)} </div>
    })
  }

  doCheck = (row, col) => {
    let data = this.state.data;
    let turn = this.props.game.state.turn;
    data[row][col] = turn;
    this.checkWin(row, col, turn);
    this.setState({ data: data })
    this.props.game.setState({ turn: turn ? 0 : 1 });
    return turn;
  }

  checkWin = (row, col, val) => {
    let { data } = this.state;
    let win = false;

    let count = 0;
    for (let i = 0; i < size; i++) {
      if (val == data[row][i]) count++;
      else count = 0;
      if (count == 5) win = true;
    }

    count = 0;
    for (let i = 0; i < size; i++) {
      if (val == data[i][col]) count++;
      else count = 0;
      if (count == 5) win = true;
    }

    count = 0;
    for (let i = 0; i < size; i++) {
      if (val == data[i][i]) count++;
      else count = 0;
      if (count == 5) win = true;
    }

    count = 0;
    for (let i = 0; i < size; i++) {
      if (val == data[i][size-i-1]) count++;
      else count = 0;
      if (count == 5) win = true;
    }

    if (win) alert('win');
  }

  render() {
    return (
      <div className="board">
        {this.renderBoard()}
      </div>
    );
  }
}