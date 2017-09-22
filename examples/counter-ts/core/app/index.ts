import { createApp } from "frint";
import { RegionService } from "frint-react";
import { createStore } from "frint-store";

import RootComponent from "../components/Root";
import rootReducer from "../reducers";

export default createApp({
  name: "CounterApp",
  providers: [
    {
      name: "component",
      useValue: RootComponent,
    },
    {
      deps: ["app"],
      name: "store",
      useFactory: ({ app }) => {
        const Store = createStore({
          initialState: {
            counter: {
              value: 5,
            },
          },
          reducer: rootReducer,
          deps: { app },
        });

        return new Store();
      },
    },
    {
      name: "region",
      useClass: RegionService,
    },
  ],
});
