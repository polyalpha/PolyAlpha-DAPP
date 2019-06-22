import {
	Root,
	Home,
	Signup,
	Auth,
	Chart1,
	Chart2,
	Chart3,
	Chart4,
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
						path: '/charts/chart1',
						exact: true,
						component: Chart1,
					},
					{
						path: '/charts/chart2',
						exact: true,
						component: Chart2,
					},
					{
						path: '/charts/chart3',
						exact: true,
						component: Chart3,
					},
					{
						path: '/charts/chart4',
						exact: true,
						component: Chart4,
					},
					{
						path: '/auth',
						exact: true,
						component: withAuth(Auth),
						title: "Hello!"
					},
					{
						path: '/auth/signup',
						exact: true,
						component: withAuth(Signup),
						title: "Hello!",
					},
					{
						path: '/auth/signin',
						exact: true,
						component: withAuth(Auth),
						title: "Hello!",
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

