import React from 'react';
import { Switch, Route } from 'frint-router-react';

import TopNav from './TopNav';

import HomePage from './HomePage';
import AboutPage from './AboutPage';

import ServicesApp from '../../app-services/app';

export default function Root() {
  return (
    <div>
      <TopNav />

      <Route path="/" component={HomePage} exact />
      <Route path="/services" app={ServicesApp} />
      <Route path="/about" component={AboutPage} />
    </div>
  );
}
