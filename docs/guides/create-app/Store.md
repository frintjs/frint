# Store

As Apps continue to grow, state becomes a requirement. Whenever a new App is instantiated, it is given its own Store. Store is where Apps keep their state internally, and can later pass it down to their Components. And bindings take care of re-rendering whenever state changes in Store.

There is an unidirectional flow of data. To illustrate this, this:

* **Actions** and state are injected in to *Components**
* **Components** trigger **Actions**
* **Actions** trigger **Reducers**
* **Reducers** update state in **Store**
* **Store**'s changes are then passed down to **Components**
* **Components** render data from latest state
* ...
* and, Components can trigger Actions again, the cycle continues.

The concepts are explained further in later sections.
