export default {
  getProps$: null,
  getInitialData() {
    return {
      computedProps: {},
    };
  },
  beforeMount() {
    if (typeof this.getProps$ !== 'function') {
      return;
    }

    this._subscription = this.getProps$(this.app)
      .subscribe((props) => {
        this.setData('computedProps', props);
      });
  },
  beforeDestroy() {
    if (this._subscription) {
      this._subscription.unsubsribe();
    }
  }
};
