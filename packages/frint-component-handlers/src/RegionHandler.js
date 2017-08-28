/* global window */
/* eslint-disable no-console */
import _ from 'lodash';

export default {
  getInitialData() {
    return {
      list: [], // array of apps ==> { name, instance }
      listForRendering: [] // array of {name, Component} objects
    };
  },
  sendProps(appInstance, props) {
    const regionService = appInstance.get(appInstance.options.providerNames.region);

    if (!regionService) {
      return;
    }

    regionService.emit(props);
  },
  beforeMount() {
    const rootApp = (!this.app)
      ? window.app // @TODO: can we avoid globals?
      : this.app.getRootApp();

    if (!rootApp) {
      return;
    }

    this.rootApp = rootApp;
    const apps$ = rootApp.getApps$(
      this.getProp('name'),
      this.getProp('uniqueKey')
    );

    this._subscription = apps$.subscribe({
      next: (list) => {
        this.setData('list', list);
        this.getData('list').forEach((item) => {
          const {
            name: appName,
            weight: appWeight,
            multi
          } = item;
          const existsInState = this.getData('listForRendering').some((w) => {
            return w.name === appName;
          });

          // @TODO: take care of removal in streamed list too?

          if (existsInState) {
            return;
          }

          const regionArgs = this.getProp('uniqueKey')
            ? [this.getProp('name'), this.getProp('uniqueKey')]
            : [this.getProp('name')];

          if (
            this.getProp('uniqueKey') &&
            !rootApp.hasAppInstance(appName, ...regionArgs)
          ) {
            rootApp.instantiateApp(appName, ...regionArgs);
          }

          const appInstance = rootApp.getAppInstance(appName, ...regionArgs);
          if (appInstance) {
            this.sendProps(appInstance, {
              name: this.getProp('name'),
              uniqueKey: this.getProp('uniqueKey'),
              data: this.getProp('data'),
            });
          }

          this.setData(
            'listForRendering',
            this.getData('listForRendering')
              .concat({
                name: appName,
                weight: appWeight,
                instance: appInstance,
                multi: multi,
                Component: this.getMountableComponent(appInstance),
              })
              .sort((a, b) => {
                return a.weight - b.weight;
              })
          );
        });
      },
      error: (err) => {
        console.warn(`Subscription error for <Region name="${this.name}" />:`, err);
      }
    });
  },
  shouldUpdate(nextProps, nextData) {
    let shouldUpdate = !_.isEqual(this.getProps(), nextProps);

    if (!shouldUpdate) {
      const { listForRendering } = nextData;
      shouldUpdate = shouldUpdate || this.getData('listForRendering').length !== listForRendering.length;
      shouldUpdate = shouldUpdate ||
        _.zipWith(this.getData('listForRendering'), listForRendering, (prev, next) => prev.name === next.name)
          .some(value => !value);
    }

    return shouldUpdate;
  },
  afterUpdate(newProps = null) {
    let name;
    let uniqueKey;
    let data;

    if (newProps) {
      name = newProps.name;
      uniqueKey = newProps.uniqueKey;
      data = newProps.data;
    } else {
      name = this.getProp('name');
      uniqueKey = this.getProp('uniqueKey');
      data = this.getProp('data');
    }

    this.getData('listForRendering')
      .filter(item => item.instance)
      .forEach(item => this.sendProps(item.instance, {
        name,
        uniqueKey,
        data,
      }));
  },
  beforeDestroy() {
    this._subscription.unsubsribe();

    if (this.rootApp) {
      this.getData('listForRendering')
        .filter(item => item.multi)
        .forEach((item) => {
          this.rootApp.destroyApp(
            item.name,
            this.getProp('name'),
            this.getProp('uniqueKey')
          );
        });
    }
  }
};
