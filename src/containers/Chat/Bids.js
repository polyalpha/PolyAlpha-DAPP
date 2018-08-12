import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {AbtValue, ChatLayout, MessagesBlock, Message} from "./Chat"
import LocalData from '../../_services/LocalData';
import Static from '../../_constants/Static';
import {TOKEN_DECIMAL} from '../../_configs/Config';
import blockConnector from '../../_services/blockConnector.service';

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
	//= ({auth, match, users, ...props}) =>
	
	constructor(props) {
		super(props);
		this.loadProps = this.loadProps.bind(this);
		this.onCancelHandler = this.onCancelHandler.bind(this);
		this.onAcceptHandler = this.onAcceptHandler.bind(this);

		this.loadProps(props);
	}

	componentWillReceiveProps(props) {
		this.loadProps(props);
	}

	onCancelHandler = () => {
	};

	onAcceptHandler = () => {

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

		let buttonTitle = user[Static.KEY.BID_TYPE] == Static.BidType.TO ? "Cancel my bid" : "Accept bid and reply";
		let action = user[Static.KEY.BID_TYPE] == Static.BidType.TO ? this.onCancelHandler : this.onAcceptHandler;

		this.messages = [
			<Message my={true} className="chat-message-big-circle" bid={bidAmount} button={{title: buttonTitle, onClick: action}}>{user[Static.KEY.BID_MESSAGE]}</Message>
		];
	}

	render() {
		return (
			<ChatLayout {...this.props} sidebar={this.sidebar}>
				{this.props.match.params.id && <MessagesBlock messages={this.messages}/>}
			</ChatLayout>
		)
	}
};


// const defaultUsers = [
// 	[
// 		{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", date:"Yesterday"},
// 		{id: 3, name: "John Copley", avatar: "/i/avatars/adam.png", date:"Yesterday"},
// 		{id: 4, name: "MargotRobbie", avatar: "/i/avatars/adam.png", date:"Yesterday"},
// 		{id: 5, name: "Vincent van Gogh", avatar: "/i/avatars/adam.png", date:"Yesterday"},
// 	],
// 	[
// 		{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 100, abt:"2.33"},
// 		{id: 3, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 60, abt:"0.02"},
// 		{id: 4, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 80, abt:"3.01"},
// 	]
// ];

function mapStateToProps(state) {
	const { auth, users } = state;
	return { auth, users };
}

const connectedBids = connect(mapStateToProps)(Bids);
export { connectedBids as Bids };
