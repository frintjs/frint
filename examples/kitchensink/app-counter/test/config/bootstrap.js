import React from 'react';
import ReactDOM from 'react-dom';
import { BehaviorSubject } from 'rxjs';
import { jsdom } from 'jsdom';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';

global.React = React;
global.ReactDOM = ReactDOM;
global.BehaviorSubject = BehaviorSubject;
global.document = jsdom('<html><body><div id="root"></div></body></html>');
global.window = global.document.defaultView;
global.sinon = sinon;
global.mount = mount;
global.chai = chai;
global.expect = expect;
