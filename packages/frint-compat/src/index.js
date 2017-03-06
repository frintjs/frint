/* eslint-disable no-console */
import Frint from 'frint';
import FrintStore from 'frint-store';
import FrintModel from 'frint-model';
import FrintReact from 'frint-react';

import extendApp from './extendApp';
import extendStore from './extendStore';

import createComponent from './createComponent';
import PropTypes from './PropTypes';
import h from './h';
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
Frint.createComponent = createComponent;
Frint.h = h;
Frint.PropTypes = PropTypes;
Frint.render = FrintReact.render;
Frint.Region = FrintReact.Region;
Frint.observe = FrintReact.observe;
Frint.streamProps = FrintReact.streamProps;
Frint.getMountableComponent = FrintReact.getMountableComponent;

// backwards compatibility
Frint.createFactory = createFactory;
Frint.createService = createService;
Frint.mapToProps = makeMapToProps(Frint);

extendApp(Frint, FrintStore, FrintReact);
extendStore(FrintStore);

Frint.getMountableComponent = makeGetMountableComponent(Frint);
FrintReact.getMountableComponent = Frint.getMountableComponent;

// export
export default Frint;
