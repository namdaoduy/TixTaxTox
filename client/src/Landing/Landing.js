import React, { Component } from "react"
import { Redirect } from "react-router-dom"
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

  findPlayer() {
    this.socket.emit('find', true);
    this.socket.on('turn', (turn) => {
      console.log("turn: " + turn);
      this.setState({ turn: turn })
    })
    this.socket.on('match', (rkey) => {
      console.log(rkey);
      this.setState({ rkey: rkey }, () => {
        setTimeout(() => {
          this.setState({ redirect: true })
        }, 1000)
      })
    })
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
        style={styles.container} 
        className={this.state.loaded ? 'loaded' : ''}>
        <img 
          src={require("../assets/img/title.svg")} 
          style={styles.title} />
        <button
          onClick={() => this.findPlayer()} 
          style={styles.btnPlay}>
          FIND PLAYER
        </button>
        
        <div id="loader-wrapper">
          <img src={require('./../assets/img/giaw-square.svg')} id="loader"></img>
          <div className="loader-section section-left"></div>
          <div className="loader-section section-right"></div>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column'
  },
  
  title: {
    width: '80%',
    maxWidth: 500,
    maxHeight: '50vh',
    marginTop: '10vh',
    marginBottom: '10vh',
  },

  btnPlay: {
    width: '60%',
    maxWidth: 500,
    height: 60,
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#FA7921',
    letterSpacing: 5,
    fontSize: 20,
    fontFamily: 'Orbitron',
    textAlign: 'center',
    lineHeight: '40px',
  }
}