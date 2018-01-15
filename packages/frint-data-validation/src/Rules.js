/* eslint-disable func-names */
function checkIsNotEmpty({ field }) {
  return function (model) {
    if (!model[field]) {
      return false;
    }

    if (
      typeof model[field] === 'string' &&
      model[field].length === 0
    ) {
      return false;
    }

    return true;
  };
}

function checkMaxLength({ field, length }) {
  return function (model) {
    if (!model[field]) {
      return false;
    }

    if (
      typeof model[field] === 'string' &&
      model[field].length > length
    ) {
      return false;
    }

    return true;
  };
}

function checkMinLength({ field, length }) {
  return function (model) {
    if (!model[field]) {
      return false;
    }

    if (
      typeof model[field] === 'string' &&
      model[field].length < length
    ) {
      return false;
    }

    return true;
  };
}

function applyRule(checker) {
  return function (opts) {
    const options = opts;

    if (typeof options.name === 'undefined') {
      options.name = opts.field;
    }

    return {
      ...options,
      rule: model => checker(options)(model),
    };
  };
}

export default {
  isNotEmpty: applyRule(checkIsNotEmpty),
  maxLength: applyRule(checkMaxLength),
  minLength: applyRule(checkMinLength),
};
