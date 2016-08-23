# Glossary

## App

Self-containing and fully functioning application that can be used for rendering directly.

## Core

Core is the top-most parent `App`, and acts as the starting point of our whole application in the front-end.

## Widget

Widgets are `App`s, but are child-apps, and get mounted on parent apps (`Core` in this case).

## Component

Components are built, for pure rendering purpose. And they support JSX.

## Region

Regions are areas in your Component (in `Core`), where you expect other child-apps to register themselves, and get rendered.

## Store

Store is where state is stored per `App`.

## Action

Actions are payloads (plain JS objects), which trigger a reducer, which then updates the state in Store.

## Reducer

Reducers are pure functions, that accepts the existing state, and the Action (payload), and return a new updated state, which then gets set to the Store.

## Model

A model is an object that manages a part of the application state. As opposed to reducers, models _can_ mutate state. Models are singleton and shared accross the whole app and child apps upon demand.

## Service

A service is a singleton, that is shared across the whole app (and also allowed child-apps) upon demand. In plain words, a service will be the same instance everywhere.

## Factory

A factory would always return a new instance of itself, and scoped by the app (or child-app) that requested it.

