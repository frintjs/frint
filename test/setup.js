import { jsdom } from 'jsdom';

global.document = jsdom('<html><body><div id="root"></div></body></html>');
global.window = global.document.defaultView;
global.location = global.window.location;
global.navigator = { userAgent: 'node.js' };
