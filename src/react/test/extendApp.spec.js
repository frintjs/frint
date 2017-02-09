/* global describe, it, before */
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import extendApp from '../extendApp';
import h from '../h';
import Provider from '../components/Provider';

chai.use(chaiEnzyme());

describe('react › extendApp', function () {
  const props = { "a": 1, "b": 2, "c": 3 };
  const Component = function () {};

  const App = function () {};
  App.prototype.getOption = () => "COMPONENT_NAME";
  App.prototype.get = () => Component;

  let app;

  before(() => {
    extendApp(App);
    app = new App(props);
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

  describe('render with "getComponent"', () => {
    let wrapper;
    let provider;

    before(() => {
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
