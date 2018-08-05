import React, {Fragment, Component} from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import {Button} from './Button';
import $ from "jquery"
import {userActions} from "../../_actions";
import { connect } from 'react-redux';



const avatarsPath = "/i/avatars";
const defaultAvatars = ["sandy.png","sandy.png","sandy.png","sandy.png","sandy.png","sandy.png","sandy.png",
	"sandy.png","sandy.png"];


class SignupForm extends Component {

	state = {
		username: "",
		selectAvatar: "",
		fileAvatar: ""
	};

	constructor(props) {
		super(props);
		this.selectAvatar = this.selectAvatar.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.saveValue = this.saveValue.bind(this)
	}

	selectAvatar(e) {
		const $el = $(e.target);
		$(".select-avatar .selected").removeClass("selected");
		$el.addClass("selected");
		this.setState({selectAvatar: $el.attr("data-value")})
	}

	handleSubmit(e) {
		console.log(this.state);
		e.preventDefault();
		this.props.dispatch(userActions.register(this.state))
	}

	saveValue(e) {
		this.setState({[e.target.name]:e.target.value})
	}

	render() {
		return (
			<Form onSubmit={this.handleSubmit}>
				<div className="row">
					<div className="form-row">
						<label>Username</label>
						{/*<input name="username" className="input" type="text" placeholder="Type in a username you want to create"  />*/}
						<Input
							autoFocus
							placeholder="Type in a username you want to create"
							type="text"
							name="username"
							className="input"
							validations={[required, isName]}
							onChange={this.saveValue}
						/>
					</div>
				</div>
				<div className="row">
					<Input
						type="hidden"
						name="selectAvatar"
						className="input"
						value={this.state.selectAvatar}
					/>
					<label>Avatar</label>
					<div className="placeholder">Select an avatar</div>
					<div className="select-avatar">
						{defaultAvatars.map((x, i)=>{
							return (
								<div key={i} className="avatar" data-value={x} onClick={this.selectAvatar}
								style={{backgroundImage: `url(${avatarsPath+"/"+x})`}}>
								</div>
							)
						})}
						<div className="avatar animate upload">
							<input name="fileAvatar" type="file" onChange={this.saveValue}/>
							<div className="text animate">Upload your own</div>
						</div>
					</div>
				</div>
				<div className="row">
					<Button icon="svg-lightning" className="button catamaran">
						I'm new, create an address pair for me
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


function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedSignupForm = connect(mapStateToProps)(SignupForm);
export { connectedSignupForm as SignupForm };


