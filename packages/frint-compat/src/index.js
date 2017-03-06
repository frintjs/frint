/* eslint-disable no-console */
import Frint from 'frint';
import FrintStore from 'frint-store';
import FrintModel from 'frint-model';
import FrintReact from 'frint-react';

import extendApp from './extendApp';
import extendStore from './extendStore';

import createFactory from './createFactory';
import createService from './createService';
import makeMapToProps from './mapToProps';
import makeGetMountableComponent from './getMountableComponent';

// store
Frint.createStore = FrintStore.createStore;
Frint.combineReducers = FrintStore.combineReducers;
Frint.Store = FrintStore.Store;

// model
Frint.createModel = FrintModel.createModel;
Frint.Model = FrintModel.Model;

// react
Frint.createComponent = FrintReact.createComponent;
Frint.h = FrintReact.h;
Frint.PropTypes = FrintReact.PropTypes;
Frint.render = FrintReact.render;
Frint.Region = FrintReact.Region;

// backwards compatibility
Frint.createFactory = createFactory;
Frint.createService = createService;
Frint.mapToProps = makeMapToProps(Frint);

extendApp(Frint, FrintStore, FrintReact);
extendStore(FrintStore);

Frint.getMountableComponent = makeGetMountableComponent(Frint);
FrintReact.getMountableComponent = Frint.getMountableComponent;

// export (not really required)
export default {
  createFactory,
  createService,
  mapToProps: Frint.mapToProps,
  getMountableComponent: FrintReact.getMountableComponent
}
