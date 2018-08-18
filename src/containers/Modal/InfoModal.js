const {Component} = require('react');
const React = require('react');
const {Modal, Button, Transition} = require('semantic-ui-react');
const ReactDOM = require('react-dom');

var modalElement;

module.exports.show = (title, message, closeButton) => {
	modalElement = document.createElement('div');
    document.body.appendChild(modalElement);
    let modalComponent = (<InfoModal title={title} message={message} closeButton={closeButton}/>);
	ReactDOM.render(modalComponent, modalElement);
}

function unmountModal() {
    ReactDOM.unmountComponentAtNode(modalElement);
    document.body.removeChild(modalElement);
}

class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    handleClose = () => {
        unmountModal();
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
                        {/* Your private key can be used to login into your account later on. 
                        Please save it somewhere safe:<br />
                            <b>{'alsdfjklajf'}</b> */}
                            {this.props.message}
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='green' onClick={this.handleClose}>
                            {this.props.closeButton}
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Transition>
        )
    }
 }

