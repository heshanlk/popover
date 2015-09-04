"use strict";

import React from 'react';

export default class Popover extends React.Component {
  static defaultProps = {
    toggleButton: null,
    position: 'bottom',
    topOffset: 10,
    leftOffset: 0,
    horizontalJustify: 'left'
  }

  constructor(props) {
    super(props);

    this.state = {
      topOffset: 0,
      leftOffset: 0,
      isOpen: props.isOpen || false
    };
  }

  componentWillReceiveProps(props){
    if(props.isOpen != this.state.isOpen) this.setState({isOpen: props.isOpen})
  }

  componentDidMount() {
    if(this.state.isOpen) this.calculateHeights();
    if(this.props.closeOnOuterClick !== false){
      document.addEventListener('click', (ev) => {
        if(ev.target.dataset['popover']) return ev.stopImmediatePropagation();
        if(this.state.isOpen == true) this.setState({isOpen: false})
      });
    }
    let topOffset = React.findDOMNode(this.refs.toggleButton).offsetHeight + this.props.topOffset;
    this.setState({topOffset})
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.isOpen && this.state.isOpen != prevState.isOpen) this.calculateHeights();
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  calculateHeights() {
    if(!this.state.isOpen) return true
    let toggleButton = React.findDOMNode(this.refs.toggleButton)
    let popover = React.findDOMNode(this.refs.popover)

    let buttonHeight = toggleButton.offsetHeight;
    let buttonWidth = toggleButton.offsetWidth;
    let popoverHeight = popover.offsetHeight;
    let popoverWidth = popover.offsetWidth;

    let topOffset = this.calculateTopOffset()
    let leftOffset = this.calculateLeftOffset()

    this.setState({
      buttonHeight,
      popoverHeight,
      buttonWidth,
      popoverWidth,
      topOffset,
      leftOffset
    });
  }

  calculateTopOffset() {
    let offset = '0px';

    switch(this.props.position) {
      case 'top':
        offset = `-${this.state.buttonHeight + this.props.topOffset}`;
        break;
      case 'bottom':
        offset = this.state.buttonHeight + this.props.topOffset;
        break;
      case 'left':
        offset = this.props.topOffset;
        break;
      case 'right':
        offset = this.props.topOffset;
        break;
      default:
        offset = 0;
    }

    return offset;
  }

  calculateLeftOffset() {
    let offset = '0px';

    switch(this.props.position) {
      case 'top':
        offset = `-${this.props.leftOffset}`;
        break;
      case 'bottom':
        offset = this.props.leftOffset;
        break;
      case 'left':
        offset = `-${this.state.popoverWidth + this.props.leftOffset}`;
        break;
      case 'right':
        offset = this.state.buttonWidth + this.props.leftOffset;
        break;
      default:
        offset = 0;
    }

    return offset;
  }

  render() {
    if(this.props.toggleButton){
      var toggleButton = React.cloneElement(this.props.toggleButton, {
        ref: 'toggleButton',
        'data-popover': true,
        onClick: this.toggle
      });
    }
    else {
      var toggleButton = (
        <div
          style={{display: 'none'}}
          onClick={this.toggle}
          data-popover="true"
          ref="toggleButton"
        />
      )
    }

    let contentStyles = { top: this.state.topOffset }
    contentStyles[this.props.horizontalJustify] = this.state.leftOffset;

    return (
      <div className={`popover-menu ${this.props.className || ''}`}>
        {toggleButton}
        {this.state.isOpen ?
          <section
            className={`popover-content ${this.props.position} show`}
            style={contentStyles}
            onClick={this.toggle}
            ref='popover'>
            {this.props.children}
          </section>
          : null}
      </div>
    )
  }
}
