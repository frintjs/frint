import createComponent from './createComponent';
import h from './h';
import PropTypes from './PropTypes';
import render from './render';
import streamProps from './streamProps';
import isObservable from './isObservable';

import getMountableComponent from './components/getMountableComponent';
import observe from './components/observe';
import Region from './components/Region';
import Provider from './components/Provider';

import RegionService from './services/Region';


export default {
  install(Frint) {
    Frint.createComponent = createComponent;
    Frint.h = h;
    Frint.PropTypes = PropTypes;
    Frint.render = render;
    Frint.streamProps = streamProps;
    Frint.isObservable = isObservable;

    Frint.getMountableComponent = getMountableComponent;
    Frint.observe = observe;
    Frint.Region = Region;
    Frint.Provider = Provider;

    Frint.RegionService = RegionService;
  }
};
