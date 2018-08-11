import React, {Component} from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import {Button} from './Button';
import { connect } from 'react-redux';
import {history} from "../../_helpers";
import LocalData from '../../_services/LocalData';
import {txConstants} from '../../_constants';
import blockReader from '../../_services/blockReader.service';


class SignupForm extends Component {

	state = {
		username: "",
		displayName: "",
		avatarUrl: ""
	};

	constructor(props) {
		super(props);
	}

	handleSubmit = async(e) => {
		console.log(this.state);
		e.preventDefault();
		
		// Check if username is exists
		let available = await this.props.contract.isUsernameAvailable(this.state.username);
		if (available) {
			console.log('send form');
			let result = await this.props.contract.register(this.state.username, this.state.displayName, this.state.avatarUrl);
			result.on(txConstants.ON_RECEIPT, (receipt) => {
				// console.log('Transaction success');
				// console.log(receipt);
				LocalData.setLoggedIn();
				blockReader.startRunLoop();
				history.push("/chat/discover");
			}).on (txConstants.ON_ERROR, (err, txHash) => {
				// console.log('transaction error: ' + txHash);
			}).on(txConstants.ON_APPROVE, (txHash) => {
				// console.log('transaction approved: ' + txHash);
			})
			
		} else {
			console.log('Username is already exists');
			// Show error: Username is already exists
		}

		// this.props.dispatch(userActions.register(this.state))
	}

	render() {
		return (
			<Form onSubmit={this.handleSubmit}>
				<div className="row">
					<div className="form-row">
						<label>Username</label>
						<Input
							autoFocus
							placeholder="Type in a username you want to create"
							type="text"
							name="username"
							className="input"
							validations={[required, isName, lengthCheck]}
							value={this.state.username}
							onChange={(e) => this.setState({username: e.target.value})}
						/>
					</div>
				</div>

				<div className="row">
					<div className="form-row">
						<label>Display name</label>
						<Input
							autoFocus
							placeholder="Type in your name"
							type="text"
							name="displayName"
							className="input"
							validations={[required, lengthCheck]}
							value={this.state.displayName}
							onChange={(e) => this.setState({displayName: e.target.value})}
						/>
					</div>
				</div>


				<div className="row">
					<label>Avatar URL</label>
					<Input
							placeholder="Enter your avatar URL"
							type="text"
							name="avatarUrl"
							className="input"
							validations={[required, lengthCheck]}
							value={this.state.avatarUrl}
							onChange={(e) => this.setState({avatarUrl: e.target.value})}
						/>
				</div>
				<div className="row">
					<Button icon="svg-lightning" className="button catamaran">
						Sign up
					</Button>
				</div>
			</Form>
		)
	}
}


const FormError = ({children}) =>
	<div className="form-error">{children}</div>;

const required = (value) => {
	if (!value.toString().trim().length) {
		// We can return string or jsx as the 'error' prop for the validated Component
		return <FormError>Require</FormError>;
	}
};

const isName = (value) => {
	// get the maxLength from component's props
	if (!/^\w{3,}$/.test(value)) {
		// Return jsx
		return <FormError>Bad name</FormError>
	}
};

const lengthCheck = (value) => {
	if (value.length > 32) {
		return <FormError>Value is too long</FormError>
	}
}


function mapStateToProps(state) {
	const { auth, contract } = state;
	return { auth, contract };
}

const connectedSignupForm = connect(mapStateToProps)(SignupForm);
export { connectedSignupForm as SignupForm };


