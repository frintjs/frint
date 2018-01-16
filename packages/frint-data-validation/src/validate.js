/* eslint-disable no-proto, func-names */
function extractRules(model, options) {
  // check if rules are passed manually
  if (options.rules) {
    return options.rules;
  }

  // check if Model class had rules defined statically
  if (
    !model ||
    !model.__proto__ ||
    !model.__proto__.constructor ||
    !model.__proto__.constructor.validationRules
  ) {
    return [];
  }

  const rules = model.__proto__.constructor.validationRules;

  // rules not defined properly
  if (!Array.isArray(rules)) {
    throw Error(`Validation rules not defined correctly in Model`);
  }

  return rules;
}

export default function validate(model, opts = {}) {
  const options = {
    rules: null,
    ...opts,
  };
  const rules = extractRules(model, options);

  if (rules.length === 0) {
    // nothing to validate
    return [];
  }

  const result = rules
    .map(function (r) {
      const {
        rule,
        message,
        name
      } = r;

      const output = rule(model);

      if (output === false) {
        return {
          name,
          message,
        };
      }

      return null;
    })
    .filter(r => r);

  return result;
}
