import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessagesBlock, ChatLayout} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"


const SearchInput = (props) => (
	<input placeholder="Search" className="tabs-search" type="text" name="search" onChange={
		e => console.log(e.target.value)
	}/>
);


const Chats = ({users, match, ...props}) => {
	let tabs = [<SearchInput key="chats-search" />];
	users = users || defaultUsers[0];
	let sidebar = {
		name: "chats",
		tabs, users
	};

	let messages = [];

	return (
		<ChatLayout {...props} sidebar={sidebar}>
			{match.params.id && <MessagesBlock messages={messages} />}
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

const connectedChats = connect(mapStateToProps)(Chats);
export { connectedChats as Chats };
