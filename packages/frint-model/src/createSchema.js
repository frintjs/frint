import Schema from './Schema';

// Would create a schema
export default function createSchema(schemaDescription) {
  let schema = new Schema();
  schema.initialize(schemaDescription);
  return schema;
}
