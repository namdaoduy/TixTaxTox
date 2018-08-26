import React, { Component } from "react"

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.onSend();
    }
  }

  onSend = () => {
    if (this.input.current.value) {
      this.props.send(this.input.current.value);
      this.input.current.value = '';
      this.input.current.blur();
    }
  }

  render() {
    return(
      <div className='chat-container'>
        <img 
          onClick={this.onSend}
          src={require('./../assets/img/chat.svg')} alt=""
          className='chat-icon'
        />
        <input 
          ref={this.input}
          className='chat-input'
          onKeyPress={this.onEnter} 
          maxLength="30"
        />
      </div>
    )
  }
}