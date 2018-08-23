import React, {Component, Fragment} from 'react';
import {Modal} from './Modal';


export default class ErrorModal extends Modal {

  static defaultProps = {
    hideClose: true,
    className: "modal-error",
    title: "Error",
  };

  static show(message, closeHandler) {
    return super.show.call(this, {message, closeHandler})
  }

  getActions = () => {
    return [{
      title: "OK",
      onClick: this.close,
    }]
  };

}

