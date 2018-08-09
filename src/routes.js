import {
	Root,
	Home,
	Signup,
	Auth,
	Chat,
	Discover,
	Bids,
	Chats
} from "./containers"

import {SettingsGas, SettingsNetwork, Settings, SettingsMain} from './containers/Settings/Settings'
import {MainBlock} from './containers/App/App'

import {withAuth} from "./_components/withAuth"


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
						component: Auth,
						title: "Auth"
					},
					{
						path: '/auth/signup',
						exact: true,
						component: Signup,
						title: "Signup",
					},
					{
						path: '/auth/signin',
						exact: true,
						component: Auth,
						title: "Login",
					},
					{
						path: '/settings',
						exact: true,
						component: SettingsMain,
						title: "Settings",
					},
					{
						component: Chat,
						routes: [
							{
								path: '/chat/discover/:tab?/:id?',
								exact: true,
								component: Discover,
							},
							{
								path: '/chat/bids/:tab?/:id?',
								exact: true,
								component: Bids,
							}
							,
							{
								path: '/chat/chats/:tab?/:id?',
								exact: true,
								component: Chats,
							}
						]
					}
				]
			},

		]
	},

];


export default routes;

