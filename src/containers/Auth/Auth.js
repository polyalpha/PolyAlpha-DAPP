import React, {Component, Fragment} from "react";
import { connect } from 'react-redux';
import {DivButton} from "./Button";
import {history} from "../../_helpers";
import {MainTitle} from "../App/MainTitle"
import {Link} from "react-router-dom"
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Textarea from 'react-validation/build/textarea';
import {Button} from './Button';
import ethereumUtil from 'ethereumjs-util';
import keythereum from 'keythereum';
import LocalData from '../../_services/LocalData';
import {userActions} from '../../_actions';
import blockReader from '../../_services/blockReader.service';
import blockConnector from '../../_services/blockConnector.service';
import Utils from '../../_helpers/Utils';

class Auth extends Component {

	constructor(props) {
		super(props);
		this.pp = ["Welcome to the next generation decentralised, private and scaleable instant messenger that pays you ABT tokens for your attention.", "When you sign up you will recieve a PolyAlpha messenger address pair on the Ethereum Testnet. If you already have an account, log in with your private key."];
		this.state = {privateKey: "", isLoading: false};

		this.signinHandler = this.signinHandler.bind(this);
		// this.loadContract();
	}

	// loadContract = async () => {
	// 	this.blockConnector = new BlockConnector(web3, [{secretKey: Buffer.from(LocalData.getPrivateKey(), 'hex'), address: LocalData.getAddress()}]);
	// 	await this.blockConnector.load();
	// 	console.log('Connected to smart contracts');
	// }

	keyValidator = () => {
		if (!/^[\da-z]{64}$/.test(this.state.privateKey.toString().trim())) {
			return <div>Bad format secret key</div>;
		} else if (!ethereumUtil.isValidPrivate(Buffer.from(this.state.privateKey, 'hex'))) {
			return <div>Invalid private key</div>;
		}
	};

	createNewAccount = (e) => {
		e.preventDefault();
		let dk = keythereum.create();
		LocalData.setPrivateKey(dk.privateKey.toString('hex'));
		blockConnector.setAccounts([{secretKey: Buffer.from(LocalData.getPrivateKey(), 'hex'), address: LocalData.getAddress()}]);
		history.push("/auth/signup");
	}

	signinHandler = async (e) => {
		window.WWW = e;
		e.preventDefault();
		this.setState({isLoading: true});
		LocalData.setPrivateKey(this.state.privateKey);
		blockConnector.setAccounts([{secretKey: Buffer.from(LocalData.getPrivateKey(), 'hex'), address: LocalData.getAddress()}]);

		// console.log(this.props);

		// Need to show LOADING
		console.log(LocalData.getAddress());
		let isRegistered = await blockConnector.isRegistered();
		console.log(isRegistered);
		if (isRegistered) {
			let user = await blockConnector.getAccount();
			let username = Utils.hexToString(user[2]);
			let name = Utils.hexToString(user[3]);
			let avatarUrl = Utils.hexToString(user[4]);
			LocalData.setLoggedIn(username, name, avatarUrl);
			this.props.dispatch(userActions.loggedIn());
			blockReader.startRunLoop();
			this.setState({isLoading: false});
			history.push("/chat/discover");
		} else {
			this.setState({isLoading: false});
			history.push("/auth/signup");
		}
	};

	checkIsLoading = () => {
		if (this.state.isLoading) {
			return "false";
		}
	}

	render() {
		const signin = (
			<Button icon="svg-crown" className="button catamaran" isLoading={this.state.isLoading} 
				loadingContent='Logging in...' content='I want my bids, log me in'/>				
		);

		console.log(this.props);

		return (
			<Fragment>
				<MainTitle>{this.props.route.title}</MainTitle>
				<div id="body-index">
					<div className="info catamaran">{this.pp.map((x, i)=><p key={i}>{x}</p>)}</div>
					<div className="buttons-block">
						<div className="signup row">
							<Link to="/auth/signup">
								<DivButton icon="svg-lightning"  className="button catamaran" onClick={this.createNewAccount}>
									I'm new, create an address pair for me
								</DivButton>
							</Link>
						</div>
						<Form className="signin row" method="POST" onSubmit={this.signinHandler}>
							{this.props.route.path === "/auth/signin" && (
								<Fragment>
									<Textarea
										autoFocus
										placeholder="Enter your private key"
										type="text"
										name="key"
										className="private-key catamaran"
										validations={[this.keyValidator]}
										value={this.privateKey}
										onChange={(e) => this.setState({privateKey: e.target.value})}
										rows={1}
									/>
									{signin}
									<Input 
										hidden
										validations={[this.checkIsLoading]}
									/>
								</Fragment>

							) || (
								<Fragment>
									<Link to="/auth/signin">{signin}</Link>
								</Fragment>
							)}
						</Form>
					</div>
				</div>
			</Fragment>
		)
	}
};

function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedAuth = connect(mapStateToProps)(Auth);
export { connectedAuth as Auth };
