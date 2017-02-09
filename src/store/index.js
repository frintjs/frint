import Store from './Store';
import createStore from './createStore';
import combineReducers from './combineReducers';

export default {
  install(Frint) {
    Frint.Store = Store;
    Frint.createStore = createStore;
    Frint.combineReducers = combineReducers;
  }
};
