import { App } from "frint";

declare global {
  interface Window {
    app: App;
  }
}
