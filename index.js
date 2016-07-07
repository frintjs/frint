const createApp = require('./lib/createApp.js');
const createComponent = require('./lib/createComponent.js');
const Model = require('./lib/Model');
const createModel = require('./lib/createModel');
const createService = require('./lib/createService');
const createFactory = require('./lib/createFactory');

const render = require('./lib/render.js');

const Region = require('./lib/components/Region.js');

const combineReducers = require('redux').combineReducers;
const mapToProps = require('./lib/components/mapToProps');

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
  mapToProps
};
