import _ from 'lodash';

// Categorizes the default values
function DefaultValues() {
  this.defaults = {}; // Basically a k/v map
}

function extractDefaultValue(fieldSchema, key) {
  let defaultValue = '';
  if (fieldSchema && typeof fieldSchema.default === 'string') {
    defaultValue = fieldSchema.default;
  }
  let result = { };
  result[key] = defaultValue;
  return defaultValue;
}

DefaultValues.prototype.initialize = function initialize(schemaDescription) {
  this.defaults = _.chain(schemaDescription)
    .mapValues(extractDefaultValue)
    .assign(this.defaults)
    .value();
};

DefaultValues.prototype.applyToModelInstance = function applyToModelInstance(instance) {
  _.forEach(this.defaults, function setFieldValue(defaultValue, field) {
    if (!instance.has(field)) {
      instance.set(field, defaultValue);
    }
  });
};

export default DefaultValues;
