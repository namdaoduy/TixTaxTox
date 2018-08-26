import React, { Component } from "react"
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { Landing } from './../Landing'
import { Game } from './../Game'
import { EndGame } from './../EndGame'

var socket = io('https://api.gameinaweb.ga', {'forceNew': true });
// var socket = io('127.0.0.1:3000', {'forceNew': true });

export default class MainRouter extends Component {
  render() {
    return(
      <Router>
        <div>
          <Route exact path="/" render={(props) => 
            <Landing key={"landing" + Date.now()} {...props} socket={socket}/>}/>
          <Route path="/game" render={(props) => 
            <Game key={"game" + Date.now()} {...props} socket={socket}/>}/>
          <Route path="/end" render={(props) => 
            <EndGame key={"end" + Date.now()} {...props} />}/>
          <Redirect from='*' to='/' />
        </div>
      </Router>
    )
  }
}
