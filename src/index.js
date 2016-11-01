import { combineReducers } from 'redux';

import createApp from './createApp';
import createComponent from './createComponent';
import createFactory from './createFactory';
import createModel from './createModel';
import createService from './createService';
import mapToProps from './components/mapToProps';
import Model from './Model';
import PropTypes from './PropTypes';
import Region from './components/Region';
import render from './render';
import isObservable from './utils/isObservable';

export default {
  combineReducers,
  createApp,
  createComponent,
  createFactory,
  createModel,
  createService,
  mapToProps,
  Model,
  PropTypes,
  Region,
  render,
  isObservable,
};
