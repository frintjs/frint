import { jsdom } from 'jsdom';

global.document = jsdom('<html><body></body></html>');
global.window = global.document.defaultView;
global.location = global.window.location;
global.navigator = { userAgent: 'node.js' };
