# Glossary

## App(object specifications)

A self-containing and fully functioning application, which can be rendered directly.

An `App` can be called `Core`, or a `Widget`: If it is defined as the top-most `App`, it will be regarded as `Core`; if it is lower on the hierarchy, it will be regarded as a `Widget`. The difference in terminology is only to shed light on their parent-child relationship.

Each `App` can have multiple `Region`s, areas where child apps will be rendered.

# object specifications
* component: _required argument_. Component to be rendered on the page.
* appId:  _required argument_. Unique identifier for each `App`

## Core

Core is the top-most parent `App`, and acts as the starting point of our whole application in the front-end. Think of this as the top of the DOM tree, where further child & grand-children app can be mounted.


Child apps can register themselves to the core by setting a `Region`, which specifies the DOM node on which these child apps will be mounted onto.

## Widget

Widgets are also `App`s, but they are child-apps further down in the component hierarchy. They are mounted onto parent apps (Core in this case).

`Widgets`, in turn, can also have their own `Regions` for grand-children apps to be mounted onto, further expanding the DOM tree structure.

## Component

`Components` is the render method that is required for any app. Components returns the `<div>` and `<p>` tags, namely, the DOM elemenets to be rendered. They are built for pure rendering purpose. And they support JSX. Think of it as the logical equivalent of `React.render()`, which return the element to be shown on the page.

## Region

Regions are areas in your `Component`, where child-apps are rendered. It can be understood as a fake DOM, which components can be mounted onto; it specifies the physical space on the webpage, and let child-apps know where they should appear on the page.

## Store

Each `App` have its own state object, stored in the namesake `Store`.

## Action

Actions are payloads of information (plain JS objects), which trigger a `Reducer`, which then updates the state in Store.

## Reducer

Reducers are pure functions, where the logic of the application lives. They calculate the changes, and returns the answer. They accepts the existing state, and the Action (payload), and return a new updated state, which then gets set to the `Store`.

## Model

A model is an object that manages a part of the application state. As opposed to reducers, models _can_ mutate state. Models are singleton and shared accross the whole app and child apps upon demand.

## Service

A service is a singleton function that is shared across the whole app. Regardless of the app hierarchy that requested it (parent-app or child-app, core or widget), it will always return the same instance. In plain words, a service will be the same instance everywhere.

## Factory

A factory would always return a new instance of itself, and scoped by the app (or child-app) that requested it.

