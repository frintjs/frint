import React from 'react';
import { Switch, Route } from 'frint-router-react';

import TopNav from './TopNav';

import HomePage from './HomePage';
import AboutPage from './AboutPage';

import ContactApp from '../../app-contact/app';
import ServicesApp from '../../app-services/app';

export default function Root() {
  return (
    <div>
      <TopNav />

      <Route path="/" component={HomePage} exact />
      <Route path="/about" getComponent={cb => cb(null, AboutPage)} />
      <Route path="/contact" app={ContactApp} />
      <Route path="/services" getApp={cb => cb(null, ServicesApp)} />
    </div>
  );
}
