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

import {withAuth} from "./_components/withAuth"


const routes = [
	{
		component: Root,
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
	}
];


export default routes;

