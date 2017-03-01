import h from './h';
import Provider from './components/Provider';

export default function extendApp(App) {
  App.prototype.getComponent = function getComponent(componentProps = null) {
    const Component = this.get(this.getOption('providerNames.component'));
    const self = this;

    return () => (
      <Provider app={self}>
        <Component {...componentProps} />
      </Provider>
    );
  };

  ['beforeMount', 'afterMount', 'beforeUnmount'].forEach((hookName) => {
    App.prototype[hookName] = function lifecycleHook(...args) {
      const { [hookName]: hook = function noop() {} } = this.options;
      try {
        return hook.apply(this, args);
      } finally {
        this[hookName] = hook;
      }
    };
  });
}
