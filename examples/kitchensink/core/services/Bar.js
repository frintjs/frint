export default class Bar {
  constructor({ app }) {
    this.app = app;
  }

  getAppName() {
    return this.app.getName();
  }
}
