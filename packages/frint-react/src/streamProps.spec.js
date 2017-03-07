/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { Observable } from 'rxjs';

import streamProps from './streamProps';

describe('frint-react › streamProps', function () {
  it('is a function', function () {
    expect(streamProps).to.be.a('function');
  });

  it('streams with default object', function (done) {
    const streamer = streamProps({
      key: 'value',
    });

    streamer.get$()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          key: 'value',
        });

        done();
      });
  });

  it('streams plain object, by merging with default', function (done) {
    const streamer = streamProps({
      key: 'value',
      key2: 'value2',
    });

    streamer.set({
      key2: 'value2 overridden',
      key3: 'value3'
    });

    streamer.get$()
      .last()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          key: 'value',
          key2: 'value2 overridden',
          key3: 'value3',
        });

        done();
      });
  });

  it('streams key/value pairs, by merging with default', function (done) {
    const streamer = streamProps({
      key: 'value',
    });

    streamer.set('key2', 'value2 overridden');
    streamer.set('key3', 'value3');

    streamer.get$()
      .last()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          key: 'value',
          key2: 'value2 overridden',
          key3: 'value3',
        });

        done();
      });
  });

  it('streams multiple observables with mappings, by merging with default', function (done) {
    const streamer = streamProps({
      key: 'value',
    });

    const names$ = Observable.of(
      'Fahad',
      'Ricardo',
      'Mark',
      'Jean',
      'Alex' // last one wins
    );
    const numbers$ = Observable.of(
      1,
      2,
      3 // last one wins
    );

    streamer.set(
      names$,
      name => ({ name }) // final plain object
    );

    streamer.set(
      numbers$,
      number => number * 2, // direct mapped values
      number => Observable.of(number), // even mapped observables
      number => ({ number }) // final plain object
    );

    streamer.get$()
      .last()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          key: 'value',
          name: 'Alex',
          number: 6, // 3 * 2
        });

        done();
      });
  });

  it('steams dispatchable actions against store', function (done) {
    const streamer = streamProps();
    let dispatchedPayload;

    const fakeStore = {
      dispatch(payload) {
        dispatchedPayload = payload;
      }
    };

    function myActionCreator(value) {
      return {
        type: 'MY_ACTION_TYPE',
        value,
      };
    }

    streamer.setDispatch(
      { myAction: myActionCreator },
      fakeStore
    );

    streamer.get$()
      .last()
      .subscribe(function (props) {
        props.myAction('someValue');

        expect(dispatchedPayload).to.deep.equal({
          type: 'MY_ACTION_TYPE',
          value: 'someValue',
        });

        done();
      });
  });

  it('has no impact if unexpected values are set', function (done) {
    const streamer = streamProps({
      key: 'value',
    });

    streamer.set(() => 'blah');

    streamer.get$()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          key: 'value',
        });

        done();
      });
  });
});
