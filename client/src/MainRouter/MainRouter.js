import React, { Component } from "react"
import io from 'socket.io-client';
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Landing } from './../Landing'
import { Game } from './../Game'

var socket = io('http://127.0.0.1:3001', {'forceNew': true });

export default class MainRouter extends Component {
  render() {
    return(
      <Router>
        <div>
          <Route exact path="/" render={(props) => <Landing key="landing" {...props} socket={socket}/>}/>
          <Route path="/game" render={(props) => <Game key="game" {...props} socket={socket}/>}/>
        </div>
      </Router>
    )
  }
}
