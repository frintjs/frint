import React from 'react';
import { observe } from 'frint-react';

const Root = React.createClass({
  render() {
    return (
      <div>
        <strong>App: Reversed</strong> - {this.props.text.split('').reverse().join('')}
      </div>
    );
  }
});

export default observe(function (app) {
  const region = app.get('region');

  const regionData$ = region.getData$();

  return regionData$
    .map((data) => {
      return {
        text: data.text,
      };
    })
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      }
    }, {
      text: ''
    });
})(Root);
