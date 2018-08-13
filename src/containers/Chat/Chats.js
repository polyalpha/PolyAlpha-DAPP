import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, Message, MessagesBlock, ChatLayout} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"
import LocalData from "../../_services/LocalData";
import blockConnector from '../../_services/blockConnector.service';
import Static from '../../_constants/Static';
import {TOKEN_DECIMAL} from '../../_configs/Config';



const onClickHandler = (e) => {
	console.log(e.target)
};


const SearchInput = (props) => (
	<input placeholder="Search" className="tabs-search" type="text" name="search" onChange={
		e => console.log(e.target.value)
	}/>
);


const Chats = ({users, match, ...props}) => {
	let tabs = [<SearchInput key="chats-search" />];
	let chatAddresses = users.chatAddresses;
	let chatUsers = LocalData.getUsers(chatAddresses);
	let sidebar = {
		name: "chats",
		tabs, users: chatUsers,
		userId: match.params.id
	};

	let user = LocalData.getUser(match.params.id);
	let bidAmount = parseInt(user[Static.KEY.BID_AMOUNT] / TOKEN_DECIMAL);
	let mine = user[Static.KEY.BID_TYPE] == Static.BidType.TO;
	console.log('Bid type: ' + user[Static.KEY.BID_TYPE]);

	let messages = [
		<Message my={mine} bid={bidAmount} isEarned={false} key={1}>{user[Static.KEY.BID_MESSAGE]}</Message>,
	];
	let rawMessages = user[Static.KEY.MESSAGES];
	if (rawMessages != undefined) {
		for (var i=0;i<rawMessages.length;i++) {
			console.log('Message type: ' + rawMessages[i][Static.KEY.MESSAGE_TYPE]);
			let mine = rawMessages[i][Static.KEY.MESSAGE_TYPE] == Static.MsgType.TO;
			messages.push(<Message key={2 + i} my={mine} type='pending'>{rawMessages[i][Static.KEY.MESSAGE_CONTENT]}</Message>);
		}
	}

	return (
		<ChatLayout {...props} sidebar={sidebar}>
			{match.params.id && <MessagesBlock messages={messages} />}
		</ChatLayout>
	)
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

const connectedChats = connect(mapStateToProps)(Chats);
export { connectedChats as Chats };
