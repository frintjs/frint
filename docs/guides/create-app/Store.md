# Store

As Apps continue to grow, managing a consistent, easily-traceable state become more challenging. We manage this by having a state object in our application; and this state object, lives in `Store`, which is unique to each App.

Whenever a new App is instantiated, it is given its own Store. Store is where Apps keep their state internally, and can later pass it down to their Components. And bindings take care of re-rendering whenever state changes in Store.

There is an unidirectional flow of data. To illustrate this, consider the following:

* **Actions** and state are injected in to *Components**
* **Components** trigger **Actions**
* **Actions** trigger **Reducers**
* **Reducers** update state in **Store**
* **Store**'s changes are then passed down to **Components**
* **Components** render data from latest state
* ...
* and, Components can trigger Actions again, the cycle continues.

The concepts are explained further in later sections.
