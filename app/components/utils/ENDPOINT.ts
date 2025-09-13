const ENDPOINTS = {
	auth: {
		login: 'user/login',
		signup: 'user/signup',
		logout: 'user/logout',
		refresh: 'user/refresh-token',
		delete: 'user/delete',
		forgotPassword: 'user/password-reset/request',
		resetPassword: 'user/password-reset/confirm',
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
		all: 'category/all',
		create: 'category/create',
	},
	schedule: {
		root: 'schedule/',
		day: 'schedule/day/',
		month: 'schedule/month/',
	},
	charts: {
		root: 'stats/',
	},
	recurrenceException: {
		root: 'recurrenceexception/',
		create: 'recurrenceexception/create',
	},
};

export default ENDPOINTS;
