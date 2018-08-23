import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import classNames from "classnames";
import {Svg} from "../App/Svg";
import "./Modal.scss"
import {history} from "../../_helpers";



export class Modal extends Component {

  static Layout = ModalLayout;
  static Button = ModalButton;

  static defaultProps = {
    hideClose: false,
    actions: [],
  };

  static show(props) {
    return ReactDOM.render(
      React.createElement(this, Object.assign({...this.defaultProps}, props)),
      document.getElementById("modal")
    );
  }

  constructor(props) {
    super(props);
    this.historyUnlisten = history.listen(this.close);
  }

  componentWillUnmount() {
    this.historyUnlisten()
  }

  close = () => {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
  };

  render() {
    const props = {close: this.close, ...this.props};
    if ((!props.actions || props.actions.length === 0) && this.getActions) {
      props.actions = this.getActions();
    }
    let i = 0;
    const buttons = props.actions && props.actions.map(
      x => <ModalButton key={i++} {...x} />
    );
    return (
      <ModalLayout {...props}>
        <div className="content">
          {this.props.title && <div className="title">{this.props.title}</div>}
          {this.props.message && <div className="message">{this.props.message}</div>}
        </div>
        {buttons && buttons.length > 0 && <div className="actions">{buttons}</div>}
      </ModalLayout>
    )
  }

}

const ModalLayout = ({className, hideClose, close, children}) => (
  <div className={classNames(["modal-container", className])}>
    <div className="window">
      <div className="block">
        {!hideClose && (
          <div className="close">
            <Svg id="svg-close" onClick={close} />
          </div>
        )}
        {children}
      </div>
    </div>
  </div>
);

class ModalButton extends Component {

  state = {
    disabled: false
  };

  constructor(props) {
    super(props);
    this.state.disabled = props.disabled;
  }

  render() {
    const {className, onClick, disabled, title, ...props} = this.props;
    return (
      <button
        className={classNames("button", className)}
        onClick={this.props.onClick}
        disabled={this.state.disabled}
        {...props}
      >
        {title}
      </button>
    )
  }

}
