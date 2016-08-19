var createApp = require('./lib/createApp');
var createComponent = require('./lib/createComponent');
var Model = require('./lib/Model');
var createModel = require('./lib/createModel');
var createService = require('./lib/createService');
var createFactory = require('./lib/createFactory');

var render = require('./lib/render');

var Region = require('./lib/components/Region');

var combineReducers = require('redux').combineReducers;
var mapToProps = require('./lib/components/mapToProps');

var PropTypes = require('./lib/PropTypes');

module.exports = {
  createApp: createApp,
  createComponent: createComponent,
  Model: Model,
  createModel: createModel,
  createService: createService,
  createFactory: createFactory,
  render: render,
  Region: Region,
  combineReducers: combineReducers,
  mapToProps: mapToProps,
  PropTypes: PropTypes
};
