import React, {Component} from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import {Button} from './Button';
import { connect } from 'react-redux';
import {history} from "../../_helpers";
import LocalData from '../../_services/LocalData';
import {txConstants} from '../../_constants';
import Utils from '../../_helpers/Utils';
import blockReader from '../../_services/blockReader.service';
import blockConnector from '../../_services/blockConnector.service';
import ErrorModal from '../Modal/ErrorModal';

class SignupForm extends Component {

	state = {
		username: "",
		displayName: "",
		avatarUrl: "",
		isLoading: false
	};

	constructor(props) {
		super(props);
	}

	handleSubmit = async(e) => {
		console.log(this.state);
		e.preventDefault();

		this.setState({isLoading: true})
		
		// Check if username is exists
		let available = await blockConnector.isUsernameAvailable(this.state.username);

		if (available) {
			console.log('send form');
			let result = await blockConnector.register(this.state.username, this.state.displayName, this.state.avatarUrl);
			result.on(txConstants.ON_RECEIPT, async (receipt) => {
				console.log('Transaction success');
				console.log(receipt);
				let user = await blockConnector.getAccount();
				let username = Utils.hexToString(user[2]);
				let name = Utils.hexToString(user[3]);
				let avatarUrl = Utils.hexToString(user[4]);
				LocalData.setLoggedIn(username, name, avatarUrl);
				blockReader.startRunLoop();
				this.setState({isLoading: false});
				history.push("/chat/discover");
			}).on (txConstants.ON_ERROR, (err, txHash) => {
				// console.log(err.message);
				ErrorModal.show(err.message);
				console.log('transaction error: ' + txHash);
				this.setState({isLoading: false});
			}).on(txConstants.ON_APPROVE, (txHash) => {
				console.log('transaction approved: ' + txHash);
			})
		} else {
			console.log('Username is already exists');
			ErrorModal.show('"' + this.state.username + '" is already taken. Please choose another username.');
			this.setState({isLoading: false});
		}
	}

	checkIsLoading = () => {
		if (this.state.isLoading) {
			return "false";
		}
	}

	render() {
		return (
			<Form onSubmit={this.handleSubmit}>
				<div className="row">
					<div className="form-row">
						<label>Ethereum address</label>
						<Input
							disabled
							type="text"
							name="username"
							value={LocalData.getAddress()}
							className="input"
						/>
					</div>
				</div>
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

				{/* Not ask for display name for now*/}
				{/* <div className="row">
					<div className="form-row">
						<label>Display name</label>
						<Input
							placeholder="Type in your name"
							type="text"
							name="displayName"
							className="input"
							validations={[required, lengthCheck]}
							value={this.state.displayName}
							onChange={(e) => this.setState({displayName: e.target.value})}
						/>
					</div>
				</div> */}


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
					<Input 
						hidden
						validations={[this.checkIsLoading]}
					/>
				</div>
				<div className="row">
					<Button isLoading={this.state.isLoading} icon="svg-lightning" 
						className="button catamaran" content="Sign up" loadingContent="Signing up..." />
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
	const { auth } = state;
	return { auth };
}

const connectedSignupForm = connect(mapStateToProps)(SignupForm);
export { connectedSignupForm as SignupForm };
