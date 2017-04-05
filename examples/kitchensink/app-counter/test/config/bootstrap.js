import { jsdom } from 'jsdom';

import chai, { expect } from 'chai';
import sinon from 'sinon';

global.document = jsdom('<html><body><div id="root"></div></body></html>');
global.window = global.document.defaultView;
global.sinon = sinon;
global.chai = chai;
global.expect = expect;
