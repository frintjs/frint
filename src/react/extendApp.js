export default function extendApp(App) {
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
