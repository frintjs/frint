import createHistory from 'history/createHashHistory';

import makeRouterService from './makeRouterService';

export default makeRouterService(createHistory);
