import WidgetReversed from './app';

window.app.registerWidget(WidgetReversed, {
  reuse: false, // @TODO: change this property name to something like `multi` instead
  regions: ['todo-item'],
});
