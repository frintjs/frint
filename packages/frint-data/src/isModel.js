import BaseModel from './base/Model';

export default function isModel(model) {
  return model instanceof BaseModel;
}
