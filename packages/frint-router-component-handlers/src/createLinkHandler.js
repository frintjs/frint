import { composeHandlers } from 'frint-component-utils';

const LinkHandler = {
  _routerSubscription: null,

  getInitialData() {
    return {
      active: false,
    };
  },

  beforeMount() {
    this._resubscribeToRouter(this.getProps());
  },

  propsChange(nextProps, toChanged, exactChanged) {
    this._resubscribeToRouter(nextProps, toChanged, exactChanged);
  },

  beforeDestroy() {
    this._unsubscribeFromRouter();
  },

  handleClick() {
    const router = this._getRouter();
    const to = this.getProp('to');

    if (router.getMatch(to, router.getHistory(), { exact: true }) === null) {
      router.push(to);
    }
  },

  _getRouter() {
    return this.app.get('router');
  },

  _resubscribeToRouter(nextProps, toChanged = false, exactChanged = false) {
    const { activeClassName, to, exact } = nextProps;

    this._unsubscribeFromRouter();

    if (typeof activeClassName === 'string') {
      if (!this._routerSubscription || toChanged || exactChanged) {
        this._routerSubscription = this._getRouter()
          .getMatch$(to, { exact })
          .subscribe((matched) => {
            if (!matched) {
              return this.setData('active', false);
            }

            return this.setData('active', true);
          });
      }
    }
  },

  _unsubscribeFromRouter() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
      this._routerSubscription = null;
    }
  },
};

export default function createLinkHandler(ComponentHandler, app, component) {
  return composeHandlers(
    LinkHandler,
    ComponentHandler,
    {
      app,
      component
    },
  );
}
