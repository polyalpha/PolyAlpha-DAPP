import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, Message, MessagesBlock, ChatLayout} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"
import LocalData from "../../_services/LocalData";



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

	

	let messages = [
		<Message my={true} bid={98} isEarned={false} key={1}>Hey John, great to meet at TechCrunch. It is great to be able to have private conversations here.</Message>,
		<Message key={2} button={{title:"Add to whitelist", onClick: onClickHandler}}>Yea I like this project because I can use it for business development as well as partnerships.</Message>,
	];

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
	const { auth, users, contract } = state;
	return { auth, users, contract };
}

const connectedChats = connect(mapStateToProps)(Chats);
export { connectedChats as Chats };
