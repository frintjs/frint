import render from './render';
import hydrate from './hydrate';
import streamProps from './streamProps';
import isObservable from './isObservable';

import getMountableComponent from './components/getMountableComponent';
import observe from './components/observe';
import Region from './components/Region';
import Provider from './components/Provider';

import RegionService from './services/Region';

import ReactHandler from './handlers/ReactHandler';

export default {
  render,
  hydrate,
  streamProps,
  isObservable,

  getMountableComponent,
  observe,
  Region,
  Provider,

  RegionService,

  ReactHandler,
};
