import createStore from './createStore';
import combineReducers from './combineReducers';

export default {
  install(Frint) {
    Frint.createStore = createStore;
    Frint.combineReducers = combineReducers;
  }
};
