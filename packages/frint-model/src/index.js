import createModel from './createModel';
import Model from './Model';

export default {
  install(Frint) {
    Frint.Model = Model;
    Frint.createModel = createModel;
  }
};
