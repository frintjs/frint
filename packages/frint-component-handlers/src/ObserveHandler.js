export default {
  getProps$: null,
  getInitialData() {
    return {
      computedProps: {},
    };
  },
  beforeMount() {
    this._subscription = this.getProps$(this.app)
      .subscribe((props) => {
        this.setData('computedProps', props);
      });
  },
  beforeDestroy() {
    console.log('ObserveHandler: beforeDestroy');
    this._subscription.unsubsribe();
  }
};
