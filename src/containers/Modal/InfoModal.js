import React, {Component} from 'react';
import {Modal} from './Modal';


module.exports.show = (title, message, actionButton, closeButton, actionTurnOnClose, actionHandler, closeHandler) => {
	modalElement = document.createElement('div');
    document.body.appendChild(modalElement);
    let modalComponent = (<InfoModal title={title} message={message} closeButton={closeButton} actionButton={actionButton} 
        actionTurnOnClose={actionTurnOnClose} actionHandler={actionHandler} closeHandler={closeHandler} />);
	ReactDOM.render(modalComponent, modalElement);
}

class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, closeButtonDisabled: props.actionTurnOnClose};
    }

    handleClose = () => {
        if (this.props.closeHandler) {
            this.props.closeHandler();
        }
        unmountModal();
    }

    handleAction = () => {
        if (this.props.actionHandler) {
            this.props.actionHandler();
        }
        this.setState({closeButtonDisabled: false});
    }

    componentDidMount() {
        this.setState({visible: true});
    }

    render() {
        return (
            <Transition visible={this.state.visible} animation='fade' duration={500}>
                <Modal basic open={true} size='small' id='infoModal' onClose={this.handleClose} closeOnDimmerClick={false}>
                    <Modal.Header>{this.props.title}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            {this.props.message}
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' onClick={this.handleAction}>
                            {this.props.actionButton}
                        </Button>
                        <Button basic color='red' onClick={this.handleClose} disabled={this.state.closeButtonDisabled}>
                            {this.props.closeButton}
                        </Button>
                        
                    </Modal.Actions>
                </Modal>
            </Transition>
        )
    }
}
