import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessageContext, ChatLayout, MessagesBlock} from "./Chat"
import classnames from "classnames"
import {Link} from "react-router-dom"



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

	let messages = [];

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
