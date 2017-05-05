import _ from 'lodash';

class FieldType {
  constructor(typeName, ...props) {
    _.assign(this, ...props);
    this.typeName = typeName;
  }
}

export default FieldType;
