const {Component} = require('react');
const React = require('react');
const {Modal, Button, Transition} = require('semantic-ui-react');
const ReactDOM = require('react-dom');

var modalElement;

module.exports.show = (message) => {
	modalElement = document.createElement('div');
    document.body.appendChild(modalElement);
    let modalComponent = (<ErrorModal message={message} />);
	ReactDOM.render(modalComponent, modalElement);
}

function unmountModal() {
    ReactDOM.unmountComponentAtNode(modalElement);
    document.body.removeChild(modalElement);
}

class ErrorModal extends Component {
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
                <Modal open={true} basic size='small' id='errorModal' onClose={this.handleClose}>
                    <Modal.Content>
                        <h2>
                            {this.props.message}
                        </h2>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={this.handleClose}>
                            OK
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Transition>
        )
    }
 }

