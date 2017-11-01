import React from 'react';
import { observe } from 'frint-react';
import { map } from 'rxjs/operator/map';
import { scan } from 'rxjs/operator/scan';

class Root extends React.Component {
  render() {
    return (
      <div>
        <strong>App: Reversed</strong> - {this.props.text.split('').reverse().join('')}
      </div>
    );
  }
}

export default observe(function (app) { // eslint-disable-line func-names
  const region = app.get('region');

  const regionData$ = region.getData$();

  return regionData$
    ::map((data) => {
      return {
        text: data.text,
      };
    })
    ::scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {
      text: ''
    });
})(Root);
