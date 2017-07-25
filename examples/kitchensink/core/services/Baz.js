export default class Baz {
  constructor({ app }) {
    this.app = app;
  }

  getAppName() {
    return this.app.getName();
  }
}
