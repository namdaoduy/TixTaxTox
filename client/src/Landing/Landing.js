import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { AwesomeButtonProgress } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import './LandingCSS.css'

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      redirect: false,
      rkey: null,
      turn: null,
    }
    this.socket = this.props.socket;
  }

  findPlayer(el, next) {
    this.socket.removeAllListeners('turn');
    this.socket.removeAllListeners('match');

    this.socket.on('turn', (turn) => {
      this.setState({ turn: turn })
    })

    this.socket.on('match', (rkey) => {
      this.socket.removeAllListeners('turn');
      this.socket.removeAllListeners('match');
      next();
      this.setState({ rkey: rkey, loaded: false }, () => {
        setTimeout(() => {
          this.setState({ redirect: true })
        }, 1000)
      })
    })
    
    this.socket.emit('find', true);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true })
    }, 3200);
  }

  render() {
    if (this.state.redirect) return(
      <Redirect to={{
        pathname: '/game',
        state: { 
          rkey: this.state.rkey, 
          turn: this.state.turn  
        }
      }} />
    )
    else return(
      <div 
        className={'land-container' + (this.state.loaded ? ' loaded' : '')}>
        <img 
          src={require("../assets/img/title.svg")} alt=""
          className="land-title" />
        <AwesomeButtonProgress
          action={(el, next) => this.findPlayer(el, next)}
          loadingLabel="Finding ..."	
          resultLabel="MATCH !"
          size="large"
          type="primary">
          FIND PLAYER
        </AwesomeButtonProgress>
        
        <div id="loader-wrapper">
          <img src={require('./../assets/img/giaw-square.svg')} id="loader" alt=""></img>
          <div className="loader-section section-left"></div>
          <div className="loader-section section-right"></div>
        </div>
      </div>
    )
  }
}