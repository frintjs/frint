### Regions = Placeholders?

Yes. Regions can be understood as placeholders, i.e. sidebars, footer etc. It create a node to let the child widgets to mount onto.

Core App would have regions created on them; it does not know what will be rendered on that spot:
```
<div>
 <Region name="sidebar" />
</div>
```

Child widgets would then register themselves onto a region. It tells the child widget where it should appear on the page:

```
childWidget.setRegion('sidebar');
```

Please note that normally developers would not need to worry about creating regions on the core app; this is handled behind the scenes. You will only need to know how to mount child widgets on to pre-specified regions.

### Can I have a Region inside a Region?

No. Getting recursive with this would get messy and unmaintainable very soon. Only parent-child relationship would suffice.

### Can there be many core apps?

No. One core app per page, i.e. homepage has one core app, checkout one has one core app. Everything else is regarded as widgets to mark their hierarchical relationship.

## Do all widgets need to be mounted to a Region?

No. This is a legit scenario:
```
CoreApp
  - Region A: ChildApp A (mounted on a Region)
  - Region B: ChildApp B
                - ChildApp C (not mounted on a Region)
                - ChildApp D
```


### How can widget communicate with each other?

Widgets can communicate with each other by updating states via reducers. Widget should not communicate directly with each other (i.e. widget A has a handler for widget B's changes); instead, these changes would be best handled by state mutation via reducers, rather than widgets themselves. Widgets should always stay as pure as possible; meaning they are passive/reactive, it only reacts on things passed to them. This would help maintain the reusability of the widgets.

### What is the primary use case for Services?

Services are most suitable for predictable things that are non-app specific, like an HTTP service, or sessionStorage service. Services are singletons, meaning that they will always return you the same instance.

### What is the primary use case for Factories?

Factories are most suitable for things that needs to be scoped to a specific app. It always returns a new instance, unlike Services.
