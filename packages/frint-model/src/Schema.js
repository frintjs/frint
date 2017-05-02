import DefaultValues from './DefaultValues';

function Schema() {
  this.defaults = new DefaultValues(); // Will be some kind of way to keep track of the defaults
  this.validation = {}; // Takes care of storing the validation rules
}

Schema.prototype.initialize = function initialize(schemaDescription) {
  this.defaults.initialize(schemaDescription);
};

Schema.prototype.applyToModelInstance = function applyToModelInstance(instance) {
  this.defaults.applyToModelInstance(instance);
};

export default Schema;
