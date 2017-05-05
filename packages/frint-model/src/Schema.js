import DefaultValues from './DefaultValues';

function Schema() {
  this.defaults = new DefaultValues(); // Will be some kind of way to keep track of the defaults
  this.validation = {}; // Takes care of storing the validation rules
  this.isInitialized = false;
}

Schema.prototype.initialize = function initialize(schemaDescription = {}) {
  this.defaults.initialize(schemaDescription);
  this.isInitialized = true;
};

Schema.prototype.applyToModelInstance = function applyToModelInstance(instance) {
  if (!this.isInitialized) {
    throw new Error('Unable to apply schema to model, schema has not been initialized');
  }
  if (!instance) {
    return;
  }
  this.defaults.applyToModelInstance(instance);
};

export default Schema;
