export default class RouterService {
  contructor({ app, routes, history }) {
    this.app = app;
    this.routes = routes;
    this.history = history;
  }
}
