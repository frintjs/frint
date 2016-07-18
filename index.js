const createApp = require('./lib/createApp');
const createComponent = require('./lib/createComponent');
const Model = require('./lib/Model');
const createModel = require('./lib/createModel');
const createService = require('./lib/createService');
const createFactory = require('./lib/createFactory');

const render = require('./lib/render');

const Region = require('./lib/components/Region');

const combineReducers = require('redux').combineReducers;
const mapToProps = require('./lib/components/mapToProps');

const PropTypes = require('./lib/PropTypes');

module.exports = {
  createApp,
  createComponent,
  Model,
  createModel,
  createService,
  createFactory,
  render,
  Region,
  combineReducers,
  mapToProps,
  PropTypes
};
