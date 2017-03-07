export default function extendStore({ Store }) {
  Store.prototype.subscribe = function subscribe(callback) {
    this.options.console.warn('[DEPRECATED] `Store.subscribe` has been deprecated, and kept for consistency purpose only with v0.x');

    const subscription = this.getState$()
      .subscribe((state) => {
        callback(state);
      });

    return function unsubscribe() {
      subscription.unsubscribe();
    };
  };
}
