export default class Foo {
  constructor({ app }) {
    this.app = app;
  }

  getAppName() {
    return this.app.getName();
  }
}
