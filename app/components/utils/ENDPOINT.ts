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
	woktimeSeries: {
		root: 'worktimeseries/',
		create: 'worktimeseries/create',
	},
	category: {
		root: 'category/',
		create: 'category/create',
	},
	schedule: {
		root: 'schedule/',
	},
};

export default ENDPOINTS;
