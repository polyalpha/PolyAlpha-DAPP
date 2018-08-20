import {
	Root,
	Home,
	Signup,
	Auth,
	Chat,
	Discover,
	Bids,
	Chats,
	MainBlock
} from "./containers"

import {SettingsGas, SettingsNetwork, Settings, SettingsMain} from './containers/Settings/Settings'

import {withAuth} from "./_components/withAuth"
import { logout } from "./_components/logout";


const routes = [
	{
		component: Root,
		routes: [
			{
				component: Settings,
				path: '/settings/:name',
				routes: [
					{
						path: '/settings/network',
						exact: true,
						component: SettingsNetwork,
					},
					{
						path: '/settings/public',
						exact: true,
						component: SettingsGas,
					},
					{
						path: '/settings/gas',
						exact: true,
						component: SettingsGas,
					},
				]
			},
			{
				component: MainBlock,
				routes: [
					{
						path: '/',
						exact: true,
						component: withAuth(Home),
					},
					{
						path: '/auth',
						exact: true,
						component: withAuth(Auth),
						title: "Auth"
					},
					{
						path: '/auth/signup',
						exact: true,
						component: withAuth(Signup),
						title: "Signup",
					},
					{
						path: '/auth/signin',
						exact: true,
						component: withAuth(Auth),
						title: "Login",
					},
					{
						path: '/auth/logout',
						exact: true,
						component: logout(),
						title: "Logout",
					},
					{
						path: '/settings',
						exact: true,
						component: withAuth(SettingsMain),
						title: "Settings",
					},
					{
						component: Chat,
						routes: [
							{
								path: '/chat/discover/:tab?/:id?',
								exact: true,
								component: withAuth(Discover),
							},
							{
								path: '/chat/bids/:tab?/:id?',
								exact: true,
								component: withAuth(Bids),
							}
							,
							{
								path: '/chat/chats/:id?',
								exact: true,
								component: withAuth(Chats),
							}
						]
					}
				]
			},

		]
	},

];


export default routes;

