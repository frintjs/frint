import BaseModel from './base/Model';

export default function isModel(model) {
  try {
    return model instanceof BaseModel;
  } catch (e) {
    return false;
  }
}
