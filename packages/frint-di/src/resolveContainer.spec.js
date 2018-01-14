/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import createContainer from '../src/createContainer';
import resolveContainer from '../src/resolveContainer';

describe('resolveContainer', function () {
  it('resolves Container class', function () {
    const Container = createContainer([
      { name: 'foo', useValue: 'foo value' }
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo')).to.equal('foo value');
  });
});
