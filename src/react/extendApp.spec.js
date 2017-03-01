/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it, before, beforeEach, afterEach */
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import extendApp from '../extendApp';
import h from '../h';
import Provider from '../components/Provider';

chai.use(chaiEnzyme());

describe('react › extendApp', function () {
  const props = { "a": 1, "b": 2, "c": 3 };
  const Component = function () {};

  const App = function (options = {}) {
    this.options = options;
  };
  App.prototype.getOption = () => "COMPONENT_NAME";
  App.prototype.get = () => Component;

  before(() => {
    extendApp(App);
  });

  it('is a function', () => {
    expect(extendApp).to.be.a('function');
  });

  it('expects one argument: componentProps', () => {
    expect(extendApp.length).to.be.equal(1);
  });

  it('App must be a function', () => {
    expect(() => extendApp({})).to.throw(/undefined/);
  });

  it('introduces "getComponent" function', () => {
    expect(App.prototype.getComponent).to.be.a('function');
  });

  const hooks = ['beforeMount', 'afterMount', 'beforeUnmount'];
  describe(`hooks: ${hooks.join(', ')}`, () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      sandbox.reset();
    });

    hooks.forEach((hook) => {
      it(`introduces "${hook}" function`, () => {
        expect(App.prototype[hook]).to.be.a('function');
      });

      it(`"${hook}" is called with proper arguments`, () => {
        const args = ['a', 'b', 'c'];
        const app = new App({ [hook]: sinon.stub() });
        app[hook](...args);
        expect(app.options[hook]).to.have.been.calledWith(...args);
      });

      it(`does not break if "${hook}" is not defined in "options"`, () => {
        const app = new App();
        app[hook]();
      });

      it(`caches "${hook}" on resolution`, () => {
        const hookSpy = sandbox.spy(App.prototype, hook);

        const app = new App({ [hook]: sinon.stub() });

        app[hook](); // this should call the hookSpy
        app[hook](); // second call, it should call directly the stub (cache)

        expect(hookSpy).to.have.callCount(1);
        expect(app.options[hook]).to.have.callCount(2);
      });
    });
  });

  describe('"getComponent" method', () => {
    let wrapper;
    let provider;
    let app;

    before(() => {
      app = new App();
      const WrappedComponent = app.getComponent(props);
      wrapper = shallow(<WrappedComponent />);
      provider = wrapper.find(Provider);
    });

    it("renders <Provider />", () => {
      expect(provider).to.be.present();
    });

    it("wraps <Component /> with <Provider />", () => {
      expect(provider.childAt(0).type()).to.equal(Component);
    });

    it('<Provider /> receives app instance', () => {
      expect(provider.props().app).to.be.eql(app);
    });

    it('<Component /> receives props', () => {
      const component = provider.find(Component);
      expect(component.props()).to.be.eql(props);
    });
  });
});
