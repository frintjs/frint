/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import getMountableComponent from '../components/getMountableComponent';

describe('frint-react › components › getMountableComponent', function () {
  it('is a function', function () {
    expect(getMountableComponent).to.be.a('function');
  });
});
