import {
	Root,
	Home,
	Signup,
	Auth
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
			}
		]
	}
];


export default routes;

