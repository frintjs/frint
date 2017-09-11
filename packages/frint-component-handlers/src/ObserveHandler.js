import { BehaviorSubject } from 'rxjs';

export default {
  getProps$: null,
  getInitialData() {
    return {
      computedProps: {},
    };
  },
  initialize() {
    this._props$ = new BehaviorSubject(this.getProps());
  },
  receiveProps(newProps) {
    this._props$.next(newProps);
  },
  beforeMount() {
    if (typeof this.getProps$ !== 'function') {
      return;
    }

    this._subscription = this.getProps$(this.app, this._props$)
      .subscribe((props) => {
        console.log('observed props', props);
        this.setData('computedProps', props);
      });
  },
  beforeDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
};
