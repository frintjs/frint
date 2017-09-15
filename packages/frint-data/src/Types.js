import _ from 'lodash';

import TypeError from './errors/Type';
import chain from './chainType';
import isModel from './isModel';
import isCollection from './isCollection';

/**
 * Types
 */
const Types = {};

Types.string = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (typeof value !== 'string') {
    throw new TypeError('value is not a string');
  }

  return value;
});

Types.bool = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (typeof value !== 'boolean') {
    throw new TypeError('value is not a boolean');
  }

  return value;
});

Types.number = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (typeof value !== 'number') {
    throw new TypeError('value is not a number');
  }

  return value;
});

Types.array = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (!_.isArray(value)) {
    throw new TypeError('value is not an array');
  }

  return value;
});

Types.func = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (typeof value !== 'function') {
    throw new TypeError('value is not a function');
  }

  return value;
});

Types.enum = function (enums = []) {
  if (!_.isArray(enums)) {
    enums = [enums];
  }

  return chain(function (value) {
    if (typeof value === 'undefined') {
      return value;
    }

    const isValid = enums.some(function (enumValue) {
      return value === enumValue;
    });

    if (isValid) {
      return value;
    }

    throw new TypeError('value is none of the provided enums');
  });
};

Types.enum.of = function (enumTypes = []) {
  if (!_.isArray(enumTypes)) {
    enumTypes = [enumTypes];
  }

  return chain(function (value) {
    if (typeof value === 'undefined') {
      return value;
    }

    const isValid = enumTypes.some(function (enumType) {
      try {
        enumType(value);

        return true;
      } catch (e) {
        return false;
      }
    });

    if (isValid) {
      return value;
    }

    throw new TypeError('value is none of the provided enum types');
  });
};

Types.uuid = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (typeof value !== 'string') {
    throw new TypeError('value is not a valid UUID');
  }

  const check = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (check.test(value)) {
    return value;
  }

  throw new TypeError('value is not a valid UUID');
});

Types.any = chain(function (value) {
  return value;
});

/**
 * Object
 */
Types.object = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (!_.isPlainObject(value)) {
    throw new TypeError('value is not an object');
  }

  return value;
});

function validateAndReturnObject(value, schema) {
  return _.mapValues(schema, (type, k) => {
    try {
      return type(value[k]);
    } catch (e) {
      throw new TypeError('schema failed for key `' + k + '`, ' + e.message);
    }
  });
}

Types.object.of = function (schema) {
  if (!_.isPlainObject(schema)) {
    throw new TypeError('`object.of` must receive a plain object');
  }

  return chain(function (value) {
    if (typeof value === 'undefined') {
      return value;
    }

    if (!_.isPlainObject(value)) {
      throw new TypeError('value is not an object');
    }

    return validateAndReturnObject(value, schema);
  });
};

/**
 * Model
 */
Types.model = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (isModel(value)) {
    return value;
  }

  throw new TypeError('value is not a Model instance');
});

Types.model.of = function (Model) {
  if (typeof Model !== 'function') {
    throw new TypeError('Model is not a function');
  }

  return chain(function (value) {
    if (typeof value === 'undefined') {
      return value;
    }

    if (isModel(value)) {
      if (value instanceof Model) {
        return value;
      }

      throw new TypeError('value is not instance of expected Model');
    }

    if (_.isPlainObject(value)) {
      return new Model(value);
    }

    throw new TypeError('value is not an object');
  });
};

/**
 * Collection
 */
Types.collection = chain(function (value) {
  if (typeof value === 'undefined') {
    return value;
  }

  if (isCollection(value)) {
    return value;
  }

  throw new TypeError('value is not a Collection instance');
});

Types.collection.of = function (Collection) {
  if (typeof Collection !== 'function') {
    throw new TypeError('Collection is not a function');
  }

  return chain(function (value) {
    if (typeof value === 'undefined') {
      return value;
    }

    if (isCollection(value)) {
      if (value instanceof Collection) {
        return value;
      }

      throw new TypeError('value is not instance of expected Collection');
    }

    if (_.isArray(value)) {
      return new Collection(value);
    }

    throw new TypeError('value is not an array');
  });
};

export default Types;
