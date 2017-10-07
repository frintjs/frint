import createHistory from 'history/createBrowserHistory';

import makeRouterService from './makeRouterService';

export default makeRouterService(createHistory);
