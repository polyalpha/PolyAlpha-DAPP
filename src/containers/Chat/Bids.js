import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {AbtValue, ChatLayout, MessagesBlock, Message} from "./Chat"
import LocalData from '../../_services/LocalData';
import Static from '../../_constants/Static';
import {TOKEN_DECIMAL} from '../../_configs/Config';
import blockConnector from '../../_services/blockConnector.service';
import Utils from '../../_helpers/Utils';
import {KEY} from '../../_constants/Static';

const sideBarTabs = [
	{
		name: "my",
		title: "Your bids"
	},
	{
		name: "me",
		title: "Bids for you"
	}
];


class Bids extends Component  {	
	constructor(props) {
		super(props);
		this.loadProps = this.loadProps.bind(this);
		this.onCancelHandler = this.onCancelHandler.bind(this);
		this.onAcceptHandler = this.onAcceptHandler.bind(this);

		this.state = {message: ""};

		this.loadProps(props);
	}

	componentWillReceiveProps(props) {
		this.loadProps(props);
	}

	onCancelHandler = () => {
	};

	onAcceptHandler = async () => {
		let { message } = this.state;

		let user = LocalData.getUser(this.props.match.params.id);
		let secret = Utils.computeSecret(Buffer.from(LocalData.getPrivateKey(), 'hex'), 
			Buffer.from('04' + user[KEY.USER_PUBKEY], 'hex'));
		let encryptedMessage = Utils.encrypt(message, secret);

		console.log('accept bid to: ' + this.props.match.params.id);
		console.log(encryptedMessage);
		let receipt = await blockConnector.acceptBid(this.props.match.params.id, '0x' + encryptedMessage);
		console.log(receipt);
	}

	onMessageChanged = (newMessage) => {
		this.setState({message: newMessage});
	}

	loadProps(props) {
		let {match, users} = props;

		match.params.tab = match.params.tab || sideBarTabs[0].name;	
		let bidAddresses;
		if (match.params.tab == "me") {
			bidAddresses = users.bidAddresses;
		} else {
			bidAddresses = users.myBidAddresses;
		}
		let bidUsers = LocalData.getUsers(bidAddresses);

		this.sidebar = {
			name: "bids",
			tab: match.params.tab,
			tabs: sideBarTabs,
			users: bidUsers,
			userId: match.params.id,
		};

		let user = LocalData.getUser(match.params.id);
		let bidAmount = parseInt(user[Static.KEY.BID_AMOUNT] / TOKEN_DECIMAL);
		let mine = user[Static.KEY.BID_TYPE] == Static.BidType.TO;

		let buttonTitle = mine ? "Cancel my bid" : "Accept bid and reply";
		let action = mine ? this.onCancelHandler : this.onAcceptHandler;

		this.messages = [
			<Message my={mine} className="chat-message-big-circle" bid={bidAmount} button={{title: buttonTitle, onClick: action}}>{user[Static.KEY.BID_MESSAGE]}</Message>
		];
	}

	render() {
		return (
			<ChatLayout {...this.props} sidebar={this.sidebar}>
				{this.props.match.params.id && <MessagesBlock messages={this.messages} onMessageChanged={this.onMessageChanged}/>}
			</ChatLayout>
		)
	}
};

function mapStateToProps(state) {
	const { auth, users } = state;
	return { auth, users };
}

const connectedBids = connect(mapStateToProps)(Bids);
export { connectedBids as Bids };
