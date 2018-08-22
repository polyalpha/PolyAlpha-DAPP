import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {MessagesBlock, MessageContext, ChatLayout, AbtValue, Message} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import LocalData from '../../_services/LocalData';
import {KEY} from '../../_constants/Static';
import Utils from '../../_helpers/Utils';
import {TOKEN_DECIMAL} from '../../_configs/Config';
import blockConnector from '../../_services/blockConnector.service';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {txConstants} from '../../_constants';
import ErrorModal from '../Modal/ErrorModal';
import Config from '../../_configs/Config';
import BigNumber from 'big-number';


const abcValidator = (value) => {
	if (parseInt(value || 0) < 0) {
		return <div>Bad value</div>;
	}
};

const required = (value) => {
	if (!value.toString().trim().length) {
		// We can return string or jsx as the 'error' prop for the validated Component
		return <div>Require</div>;
	}
};



export class CreateNewBid extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isSubmitted: false,
			isLoading: false,
			bid: 0,
			message: "",
			userId: props.userId
		};
	}

	componentWillReceiveProps(props) {
		if (props.userId != this.state.userId) {
			this.setState({
				isSubmitted: false,
				isLoading: false,
				bid: 0,
				message: "",
				userId: props.userId
			});
		}
	}

	addHandler = (e) => {
		let bid = this.state.bid + parseInt(e.target.innerText);
		bid = bid < 0 ? 0 : bid;
		this.setState({bid});
		e.preventDefault()
	};

	createHandler = async (e) => {
		e.preventDefault();
		this.setState({isLoading: true});

		let {message, bid} = this.state;

		let user = LocalData.getUser(this.state.userId);
		let secret = Utils.computeSecret(Buffer.from(LocalData.getPrivateKey(), 'hex'),
			Buffer.from('04' + user[KEY.USER_PUBKEY], 'hex'));
		let encryptedMessage = Utils.encrypt(message, secret);

		let sentAmount = Utils.parseIntSafe(bid) * TOKEN_DECIMAL;
		let tokenBalance = Utils.parseIntSafe(await blockConnector.getTokenBalance(LocalData.getAddress()));

		console.log('Token balance' + tokenBalance);
		if (tokenBalance >= sentAmount) {
			let result = await blockConnector.createBid(this.state.userId,
				sentAmount, '0x' + encryptedMessage);
			result.on(txConstants.ON_APPROVE, (txHash) => {
				// Don't need to do anything
			}).on(txConstants.ON_RECEIPT, (receipt) => {
				// this.setState({isSubmitted: true});
			}).on(txConstants.ON_ERROR, (err, txHash) => {
				// Show error
				this.setState({isLoading: false});
				ErrorModal.show(err.message);
			})
		} else {
			this.setState({isLoading: false});
			ErrorModal.show("Your account doesn't have enough " + Config.TOKEN_SYMBOL + " token.");
		}
	};

	cancelHandler = (e) => {
		this.setState({isSubmitted: false});
		e.preventDefault();
	};

	messageValidator = () => {
		if (!this.state.message.length) {
			return <div>Bad text</div>;
		}
	};

	checkIsLoading = () => {
		console.log('check is loading: ' + this.state.isLoading);
		if (this.state.isLoading) {
			return "false";
		}
		// return "false";
	}

	render() {
		let loadingSpinner = (<FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '14px'}}/>)
		console.log('render discover');
		return (
			<Fragment>
				{this.state.isSubmitted && (
					<Message my={true} bid={this.state.bid}>{this.state.message}</Message>
				) || (
					<div className="create-new-bid">
						<h2 className="raleway">Create New Bid</h2>
						<h3 className="catamaran">Enter the amount of {Config.TOKEN_SYMBOL} tokens for your new bid</h3>
						<div className="token-value">
							{this.state.bid < 0
								? (<i className="logo-image" />)
								: (<AbtValue value={this.state.bid} />)}
						</div>
						<Form className="form" onSubmit={this.createHandler}>
							<Input type="hidden" name="value" value={this.state.bid} validations={[abcValidator, this.messageValidator]}/>
							<Input
								hidden
								value={this.state.isLoading ? "true" : ""} // Change the value of this input to force the form to update the button status
								validations={[this.checkIsLoading]}
							/>
							<MessageContext.Consumer>
								{message => {
									this.state.message = message;
									return <Input type="hidden" name="value" value={message} validations={[required]}/>;
								}}
							</MessageContext.Consumer>

							<div className="values">
								<button className="button" onClick={this.addHandler}>-10</button>
								<button className="button" onClick={this.addHandler}>+10</button>
							</div>

							<Button className="submit">{this.state.isLoading && loadingSpinner}
								{this.state.isLoading ? 'Submitting bid...' : 'Submit bid'}</Button>
						</Form>
					</div>
				)}
			</Fragment>
		)
	}
}

const sideBarTabs = [
	{
		name: "new",
		title: "New Users"
	},
	{
		name: "top",
		title: "Top Users"
	}
];


const DiscoverInfo = (props) => (
	<div className="info-block">
		{/* <div className="user-info">
			<i className="img" style={{backgroundImage: "url(/i/avatars/adam.png)"}} />
			<div className="name">PolyAlpha Assistant</div>
			<div className="date">last seen yesterday</div>
		</div>
		<div className="buttons">
			<a href="#" className="button">Chat</a>
		</div>
		<div className="info">
			<div className="title">Information</div>
			<div className="text">
				<p>To use this messenger, select a user on the list on the left to bid to chat. If you need help, just
					message me.</p>
				<p>Chatting to people not in your contacts requires a bid but this is free for this proof of concept
					DAPP.</p>
				<p>Friends in your contacts are free to communicate with.</p>
				<p>This DAPP runs on Ethereum testnet so messages are not fast or private.</p>
				<p>Enjoy PolyAlpha and please send us your thoughts.</p>
			</div>
		</div> */}
	</div>
)

class Discover extends Component {
	constructor(props) {
		super(props);
		this.loadProps = this.loadProps.bind(this);
		this.loadProps(props);
	}

	componentWillReceiveProps(props) {
		this.loadProps(props);
	}

	compareUserByTotalBid(a, b) {
		let aValue = new BigNumber(a[KEY.USER_BIDS_AMOUNT]);
		let bValue = new BigNumber(b[KEY.USER_BIDS_AMOUNT]);
		if (aValue.lt(bValue)) {
			return 1;
		} else if (aValue.gt(bValue)) {
			return -1;
		} else {
			return 0;
		}
	}

	loadProps(props) {
		let {match, users} = props;

		let newAddresses = props.users.newAddresses;
		let newUsers = LocalData.getUsers(newAddresses);
		let topUsers = LocalData.getUsers(newAddresses);

		let userLists = [];
		userLists.push(newUsers);

		topUsers.sort(this.compareUserByTotalBid);
		while (topUsers.length >=0) {
			let user = topUsers[topUsers.length - 1];
			if (Utils.parseIntSafe(user[KEY.USER_BIDS_AMOUNT]) == 0) {
				topUsers.splice(-1, 1);
			} else {
				break;
			}
		}
		userLists.push(topUsers);

		match.params.tab = match.params.tab || sideBarTabs[0].name;
		users = userLists[sideBarTabs.findIndex(x=>x.name === match.params.tab )];

		this.sidebar = {
			name: "discover",
			tab: match.params.tab,
			tabs: sideBarTabs,
			users,
			userId: match.params.id,
		};

		this.messages = [<CreateNewBid userId={match.params.id} {...props}/>];

		let idExists = false;
		if (match.params.tab === "new") {
			for (let i = 0; i < newAddresses.length; i++) {
				if (newAddresses[i] === match.params.id) {
					idExists = true;
				}
			}
		}

		// // Redirect if id not exists
		// if (!idExists) {
		// 	// Automatically select first user if newAddresses.length > 0
		// 	if (this.props.device.isBrowser && match.params.tab === "new" && newAddresses.length > 0) {
		// 		history.push('/chat/discover/' + match.params.tab + "/" + newAddresses[0]);
		// 	} else if (!match.params.id) {
		// 		const path = '/chat/discover/' + match.params.tab;
		// 		path !== this.props.location.pathname && history.push(path);
		// 	}
		// }
	}

	render() {
		return (
		<ChatLayout {...this.props} sidebar={this.sidebar} back="/chat/discover/new" more={true}>
			{this.props.match.params.id && <MessagesBlock messages={this.messages}/>}
		</ChatLayout>
		)
	}
};

function mapStateToProps({ auth, users, device }) {
	return { auth, users, device };
}

const connectedDiscover = connect(mapStateToProps)(Discover);
export { connectedDiscover as Discover };
