/* eslint-disable no-proto, func-names */
function extractRules(model, givenRules) {
  // check if rules are passed manually
  if (givenRules) {
    return givenRules;
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

export default function validate(model, givenRules = null) {
  const rules = extractRules(model, givenRules);

  if (rules.length === 0) {
    // nothing to validate
    return [];
  }

  // const options = {
  //   // @TODO: handle async later
  //   // async: false,
  //   ...opts,
  // };

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

  // @TODO: handle async later
  // if (options.async) {
  //   // @TODO: handle async validations in `result`
  // }

  return result;
}
