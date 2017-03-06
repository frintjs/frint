/* eslint-disable no-console */
import CorePlugin from '../core';
import ReactPlugin from '../react';

import extendApp from './extendApp';
import extendStore from './extendStore';

import createFactory from './createFactory';
import createService from './createService';
import makeMapToProps from './mapToProps';
import makeGetMountableComponent from './getMountableComponent';

export default {
  install(Frint) {
    Frint.createApp = function createApp(...args) {
      console.warn('[DEPRECATED] `createApp` has been deprecated. Use `createCore` or `createWidget` appropriately.');

      return CorePlugin.createApp(...args);
    };

    extendApp(Frint);
    extendStore(Frint);

    Frint.createFactory = createFactory;
    Frint.createService = createService;
    Frint.mapToProps = makeMapToProps(Frint);

    Frint.getMountableComponent = makeGetMountableComponent(Frint);
    ReactPlugin.getMountableComponent = Frint.getMountableComponent;
  }
};
