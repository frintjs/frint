### Can I have a Region inside a Region?

No. Getting recursive with this would get messy and unmaintainable very soon. Only parent-child relationship would suffice.

### How can widget communicate with each other?

Widgets can communicate with each other by updating states via reducers. Widget should not communicate directly with each other (i.e. widget A has a handler for widget B's changes); instead, these changes would be best handled by state mutation via reducers, rather than widgets themselves. Widgets should always stay as pure as possible; meaning they are passive/reactive, it only reacts on things passed to them. This would help maintain the reusability of the widgets.

### What is the primary use case for Services?

Services are most suitable for things that are non-app specific, like an HTTP service, or sessionStorage service. Services are singletons, meaning that they will always return you the same instance.

### What is the primary use case for Factories?

Factories are most suitable for things that needs to be scoped to a specific app. It always returns a new instance, unlike Services.
