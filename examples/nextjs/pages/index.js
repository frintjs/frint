import { getMountableComponent } from 'frint-react';
import React from 'react';

// import Test from '../components/Test';
import CounterAppFactory from '../components/counter/core/app/index';

const CounterApp = getMountableComponent(new CounterAppFactory());

const Page = ({ source = 'client' }) => (
  <div>
    Made from the {source}
    <CounterApp />
  </div>
);

Page.getInitialProps = ({ req }) => {
  return {
    source: req ? 'server' : 'client'
  };
}

export default Page;
