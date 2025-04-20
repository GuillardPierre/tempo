import { create } from 'react-test-renderer';

const ENDPOINTS = {
	auth: {
		login: 'user/login',
		signup: 'user/signup',
		logout: 'user/logout',
		refresh: 'user/refresh-token',
	},
	worktime: {
		root: 'worktime/',
		create: 'worktime/create',
	},
	category: {
		root: 'category/',
		create: 'category/create',
	},
};

export default ENDPOINTS;
