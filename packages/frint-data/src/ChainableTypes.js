import TypesError from './errors/Types';

export const isRequired = {
  func: function isRequired(value) {
    if (typeof value === 'undefined') {
      throw new TypesError('value is not defined');
    }

    return value;
  }
};

export const defaults = {
  isFactory: true,
  func: function defaults(value, defaultValue) {
    if (value) {
      return value;
    }

    return defaultValue;
  }
};
