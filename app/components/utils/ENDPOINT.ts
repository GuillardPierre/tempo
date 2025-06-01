const ENDPOINTS = {
  auth: {
    login: 'user/login',
    signup: 'user/signup',
    logout: 'user/logout',
    refresh: 'user/refresh-token',
    delete: 'user/delete',
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
};

export default ENDPOINTS;
