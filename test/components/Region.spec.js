/* global afterEach, beforeEach, describe, it, window, document */
import { expect } from 'chai';
import React from 'react';

import createApp from '../../src/createApp';
import createComponent from '../../src/createComponent';
import Region from '../../src/components/Region';
import render from '../../src/render';

describe('components › Region', () => {
  function generateCoreAppTemplate(appOptions = {}, regionName) {
    const MyCoreComponent = createComponent({
      render() { return <Region name={regionName} />; }
    });

    const MyCoreApp = createApp({
      appId: '123',
      name: 'myAppName',
      component: MyCoreComponent
    });

    return new MyCoreApp(appOptions);
  }

  function generateWidgetAppTemplate(appName, widgetName, regionToSetTo) {
    const MyWidgetComponent = createComponent({
      render() { return (<div className="myWidgetComponent">{appName} - {widgetName}</div>); }
    });

    const MyWidgetApp = createApp({
      appId: appName,
      appName: appName,
      name: widgetName,
      component: MyWidgetComponent
    });

    const myWidgetAppInstance = new MyWidgetApp();

    myWidgetAppInstance.setRegion(regionToSetTo);

    return myWidgetAppInstance;
  }

  afterEach(() => {
    delete window.app;
    document.getElementById('root').innerHTML = '';
  });

  it('fails to mount when the "name" prop is missing (unable to set observable)', () => {
    window.app = generateCoreAppTemplate();
    expect(() => render(window.app, document.getElementById('root'))).to.throw(TypeError);
  });

  it('renders properly the region and renders a widget on it', () => {
    window.app = generateCoreAppTemplate(undefined, 'myRegionName');
    render(window.app, document.getElementById('root'));

    generateWidgetAppTemplate('app1', 'myWidgetName', 'myRegionName');
    expect(document.querySelectorAll('#root .myWidgetComponent').length).to.be.eql(1);
    expect(document.querySelector('#root .myWidgetComponent').textContent).to.be.eql('app1 - myWidgetName');
  });

  it('renders properly the region and renders two widgets on it', () => {
    window.app = generateCoreAppTemplate(undefined, 'myRegionName');
    render(window.app, document.getElementById('root'));

    generateWidgetAppTemplate('app1', 'myWidgetName1', 'myRegionName');
    generateWidgetAppTemplate('app2', 'myWidgetName2', 'myRegionName');

    expect(document.querySelectorAll('#root .myWidgetComponent').length).to.be.eql(2);
    expect(document.querySelectorAll('#root .myWidgetComponent')[0].textContent).to.be.eql('app1 - myWidgetName1');
    expect(document.querySelectorAll('#root .myWidgetComponent')[1].textContent).to.be.eql('app2 - myWidgetName2');
  });

  it('renders properly the region and renders two widgets on it, with the same name and different appNames', () => {
    window.app = generateCoreAppTemplate(undefined, 'myRegionName');
    render(window.app, document.getElementById('root'));

    generateWidgetAppTemplate('app1', 'myWidgetName', 'myRegionName');
    generateWidgetAppTemplate('app2', 'myWidgetName', 'myRegionName');

    expect(document.querySelectorAll('#root .myWidgetComponent').length).to.be.eql(2);
    expect(document.querySelectorAll('#root .myWidgetComponent')[0].textContent).to.be.eql('app1 - myWidgetName');
    expect(document.querySelectorAll('#root .myWidgetComponent')[1].textContent).to.be.eql('app2 - myWidgetName');
  });
});
