import FieldType from './FieldType';

export default {
  string: new FieldType('string'),
  complex: new FieldType('complex'),
  of: function of(nestedType) {
    return new FieldType('of', { schemaType: nestedType });     // todo: iterate on this
  },
};
