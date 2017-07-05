import createHistory from 'history/createMemoryHistory';

import makeRouterService from './makeRouterService';

export default makeRouterService(createHistory);
