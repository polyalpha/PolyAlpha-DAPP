import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {AbtValue, ChatLayout, MessagesBlock, Message} from "./Chat"


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


const onClickHandler = (e) => {
	console.log(e.target)
};


const Bids = ({auth, match, users, ...props}) => {
	match.params.tab = match.params.tab || sideBarTabs[0].name;
	users = users && users || defaultUsers[sideBarTabs.findIndex(x=>x.name === match.params.tab )];

	let sidebar = {
		name: "bids",
		tab: match.params.tab,
		tabs: sideBarTabs,
		users,
		userId: match.params.id,
	};

	let messages = [
		<Message my={true} className="chat-message-big-circle" bid={100} button={{title: "Accept bid and reply", onClick:onClickHandler}}>Hi Leonard, I am trying to get advice for my side project and I know you have experience in DAPPs as well as DAICO’s. May you give me your opinion on www.project.help please?</Message>
	];

	return (
		<ChatLayout {...props} sidebar={sidebar}>
			{match.params.id && <MessagesBlock messages={messages}/>}
		</ChatLayout>
	)
};


const defaultUsers = [
	[
		{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", date:"Yesterday"},
		{id: 3, name: "John Copley", avatar: "/i/avatars/adam.png", date:"Yesterday"},
		{id: 4, name: "MargotRobbie", avatar: "/i/avatars/adam.png", date:"Yesterday"},
		{id: 5, name: "Vincent van Gogh", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	],
	[
		{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 100, abt:"2.33"},
		{id: 3, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 60, abt:"0.02"},
		{id: 4, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 80, abt:"3.01"},
	]
];

function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedBids = connect(mapStateToProps)(Bids);
export { connectedBids as Bids };
