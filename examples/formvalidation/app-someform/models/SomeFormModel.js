// import { createModel } from 'frint-model';
import { createModel } from '../../../../packages/frint-model/src';

const Types = {
  string: "string",
  numeric: "numeric",
};

const Rules = {
  builtin: {
    required: '',
    length: '',
    range: '',
  },
};

const addressSchema = {
  line1: {
    validation: {
      type: Rules.builtin.required,
    }
  },
};

// Let's define a schema for our model
const schema = {
  name: { // Property 'name'.
    type: Types.string,   // It is a string
    default: 'abc',       // This is the default value
    validation: {
      rules: [            // These are our single-field validation rules
        {
          type: Rules.builtin.required,   // Predefined rule
          message: 'Enter your name'  // Custom validation message
        }
      ],
    }
  },
  country: {
    // default type string
    // default value ''
    // will create a get function for backwards compatibility
    validation: {
      rules: [
        { type: Rules.builtin.required },  // default validation message
        {
          type: Rules.builtin.length,
          args: { min: 2, max: 99 },
        }
      ]
    }
  },
  age: {
    type: Types.numeric,
    default: 30,
    validation: {
      rules: [
        {
          type: Rules.builtin.range,
          args: { min: 18, max: 150 },
        },
      ]
    }
  },
  comment: {},  // Nobody cares about your comment (type string, no default, no validation)
  address: { type: Types.of(addressSchema) },

  _validation: {  // Defining composite validation rules here
    rules: [
      {
        name: "young_needs_long_name",    // Not sure if we need this, but oh well
        message: "Young people must have a long name",
        validate: function validate(value, model) {
          return model.get('age') > 25 || model.get('name').length > 50;
        },
      },
    ],
  }
};

export default createModel({
  schema: schema,
  getName: function getName() {
    return this.get('name');
  },
});
