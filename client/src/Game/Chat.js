import React, { Component } from "react"

export default class Chat extends Component {
  constructor(props) {
    super(props);
  }

  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.send(e.target.value);
      e.target.value = '';
    }
  }

  render() {
    return(
      <div className='chat-container'>
        <img 
          src={require('./../assets/img/chat.svg')} 
          className='chat-icon'
          />
        <input 
          className='chat-input'
          onKeyPress={this.onEnter} 
          maxLength="30"
        />
      </div>
    )
  }
}