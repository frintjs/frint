import { render } from "frint-react";

import App from "./app";

window["app"] = new App(); // tslint:disable-line

render(
  window["app"], // tslint:disable-line
  document.getElementById("root"),
);
