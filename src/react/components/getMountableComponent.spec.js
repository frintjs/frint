/* global describe, it */
import { expect } from 'chai';

import getMountableComponent from '../../components/getMountableComponent';

describe('react › components › getMountableComponent', function () {
  it('is a function', function () {
    expect(getMountableComponent).to.be.a('function');
  });
});
