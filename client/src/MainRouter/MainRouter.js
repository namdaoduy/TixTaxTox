import React, { Component } from "react"
import io from 'socket.io-client';
import { BrowserRouter as Router, Route } from "react-router-dom"
import { AwesomeButton } from 'react-awesome-button';
import { Landing } from './../Landing'
import { Game } from './../Game'
import { EndGame } from './../EndGame'

var socket = io('http://192.168.1.101:3001', {'forceNew': true });

export default class MainRouter extends Component {
  render() {
    return(
      <Router>
        <div>
          <Route exact path="/" render={(props) => <Landing key="landing" {...props} socket={socket}/>}/>
          <Route path="/game" render={(props) => <Game key="game" {...props} socket={socket}/>}/>
          <Route path="/end" render={(props) => <EndGame key="end" {...props} />}/>
        </div>
      </Router>
    )
  }
}
