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

function extractOptions(...args) {
  if (typeof args[0] === 'string') {
    return {
      field: args[0],
      message: args[1],
      name: args[0],
      ...args[2],
    };
  }

  if (typeof args[0] === 'object') {
    return args[0];
  }

  throw new Error('Invalid arguments for validation rule');
}

export default {
  isNotEmpty: function (...args) {
    const options = extractOptions(...args);

    return {
      ...options,
      rule: model => checkIsNotEmpty(options)(model),
    };
  },
};
