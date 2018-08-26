import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { AwesomeButton } from 'react-awesome-button';
import './EndCSS.css'

export default class EndGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
    this.gofirst = this.props.location.state.gofirst;
    this.time = this.props.location.state.time;
    this.win = this.props.location.state.win;
    this.movecount = this.props.location.state.movecount;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loaded: true})
    }, 1000);
    console.log(this.gofirst);
  }

  onReplay = () => {
    this.setState({
      loaded: false,
    })
    setTimeout(() => {
      this.props.history.replace('/');
    }, 1000)
  }

  render() {
    if (this.props.history.action != 'REPLACE') 
      return( <Redirect to='/' />)
    else
      return (
        <div className={"end-container" + (this.state.loaded ? ' loaded' : '')}>
          <img className='end-title' 
            src={require('./../assets/img/title.svg')} alt="" />
          <h1 className='end-result'>
            {this.win ? 'WIN' : 'LOSS'}
          </h1>
          <div className='end-status'>
            <div className='end-key'>Move:</div>
            <div className='end-value'>{this.movecount}</div>
            <div className='end-key'>Time:</div>
            <div className='end-value'>{this.time + 's'}</div>
            <div className='end-key'>Go first:</div>
            <div className='end-value'>{this.gofirst ? 'YES' : 'NO'}</div>
          </div>
          <div 
            className="btn-replay">
            <AwesomeButton
              action={this.onReplay}
              size="large" type="primary" bubbles={true}>
              {this.win ? 'FIND STRONGER ONE!' : 'TRY TO BEAT HIM!'}
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