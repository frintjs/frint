import React, { PropTypes } from 'react';

function makePath(...paths) {
  // @TODO: make it better, a Util may be. used in Outlet too
  return [...paths].join('/')
    .replace(/\/\//g, '')
    .replace(/\/\//g, '/');
}

const Link = React.createClass({
  displayName: 'Link',

  componentDidMount() {
    this.app = this.context.app;
    this.appName = this.context.app.options.name;
    this.history = this.context.app.get('history');
    this.basePath = '/'; // @TODO: hardcoded
  },

  render() {
    const pathName = this.props.to;

    const prefix = this.props.absolute
      ? ''
      : this.basePath;

    const href = this.history.createHref(
      typeof pathName === 'string'
        ? {
          pathname: makePath(prefix + '/', pathName),
          query: {},
          state: {},
        }
        : makePath(prefix + '/', pathName) // @TODO: fix this extra slash thing
    );

    console.log('Link:', {
      appName: this.appName,
      to: this.props.to,
      absolute: this.props.absolute,
      href,
      prefix,
    });

    return (
      <a
        href={href}
        className={this.props.className}
      >{this.props.children}</a>
    );
  }
});

Link.contextTypes = {
  app: PropTypes.object.isRequired
};

export default Link;
