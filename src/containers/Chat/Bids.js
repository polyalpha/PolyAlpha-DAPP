import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessageContext} from "./Chat"
import classnames from "classnames"
import {Link} from "react-router-dom"



const sideBarTabs = [
	{
		type: "my",
		title: "Your bids"
	},
	{
		type: "me",
		title: "Bids for you"
	}
];

const BidsSideBar = ({userId, type, users}) => (
	<SideBar name="bids">
		<div className="top-bar">
			<div className="tabs">
				{sideBarTabs.map(
					tab=><Link
						className={classnames(["tab", {selected: tab.type === type }])}
						key={tab.type}
						to={`/chat/bids/${tab.type}`}
					>{tab.title}</Link>
				)}
			</div>
		</div>
		{users && <UserList userId={userId} type={type} users={users}/>}
	</SideBar>
);


const Bids = ({auth, match, users, route}) => {
	match.params.type = match.params.type || "my";
	users = match.params.type === "my" ? defaultMyUsers : defaultMeUsers;
	return (
		<Fragment>
			<BidsSideBar type={match.params.type} userId={match.params.id} users={users} />
			<MainBar>
			</MainBar>
		</Fragment>
	)
};


const defaultMyUsers = [
	{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	{id: 3, name: "John Copley", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	{id: 4, name: "MargotRobbie", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	{id: 5, name: "Vincent van Gogh", avatar: "/i/avatars/adam.png", date:"Yesterday"},
];

const defaultMeUsers = [
	{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 100, abt:"2.33"},
	{id: 3, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 60, abt:"0.02"},
	{id: 4, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 80, abt:"3.01"},
];

function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedBids = connect(mapStateToProps)(Bids);
export { connectedBids as Bids };
