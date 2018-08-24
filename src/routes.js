import {
	Root,
	Home,
	Signup,
	Auth,
	Chat,
	Discover,
	Bids,
	Chats,
	MainBlock,
} from "./containers"

import {SettingsGas, SettingsNetwork, SettingsPublicAddress, SettingsMain} from './containers/Settings/Settings'

import {withAuth} from "./_components/withAuth"
import { logout } from "./_components/logout";


const routes = [
	{
		component: Root,
		routes: [
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
						title: "Hello"
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
						component: Chat,
            path: '/chat/:type',
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
					},
          {
            path: '/settings',
            exact: true,
            component: SettingsMain,
            title: "Settings",
          },
          {
            path: '/settings/network',
            exact: true,
            component: SettingsNetwork,
          },
          {
            path: '/settings/public',
            exact: true,
            component: SettingsPublicAddress,
          },
          {
            path: '/settings/gas',
            exact: true,
            component: SettingsGas,
          }
				]
			},

		]
	},

];


export default routes;

