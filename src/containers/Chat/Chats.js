import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessagesBlock} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"


const Chats = ({auth}) => (
	<Chat title={`Hello ${auth.user.name}`}>
		<DiscoverSideBar type={match.params.type} userId={match.params.id} users={[]} />
		<MainBar>

		</MainBar>
	</Chat>
);

function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedChats = connect(mapStateToProps)(Chats);
export { connectedChats as Chats };
