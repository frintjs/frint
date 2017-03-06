import { h, createComponent, observe } from 'frint';

const Root = createComponent({
  render() {
    return (
      <div>
        <strong>Widget: Reversed</strong> - {this.props.text.split('').reverse().join('')}
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
