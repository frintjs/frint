const initialCode = `// import
const { createApp } = Frint;
const { render } = FrintReact;

// component
class Root extends React.Component {
  render() {
    return <p>Hello World</p>;
  }
}

// App
const App = createApp({
  name: 'MyTestApp',
  providers: [
    {
      name: 'component',
      useValue: Root
    }
  ]
});

// render
const app = new App();
render(app, document.getElementById('root'));`;

// editor
const editor = ace.edit('editor');
editor.setTheme('ace/theme/chrome');
editor.getSession().setMode('ace/mode/javascript');
editor.getSession().setTabSize(4);
editor.getSession().setUseSoftTabs(true);
editor.setShowPrintMargin(false);

function renderToRoot() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));

  const input = editor.getValue();

  try {
    const output = Babel.transform(input, {
      presets: [
        'es2015',
        'react',
      ]
    }).code;

    eval(output);
    updateUrlHash(input);
  } catch (error) {
    throw error;
  }
}

function parseHashParams(hash) {
  const params = hash
    .split('#?')[1];

  if (!params) {
    return {};
  }

  return params
    .split('&')
    .map(function (item) {
      const kv = item.split('=');
      const key = kv[0];
      const value = kv[1];
      return { [key]: value };
    })
    .reduce(function (acc, val) {
      return Object.assign({}, acc, val);
    }, {});
}

function updateUrlHash(code = null) {
  const currentHashParams= parseHashParams(location.hash);
  currentHashParams.code = escape(code);

  const stringifiedParams = Object.keys(currentHashParams)
    .map(function (key) {
      return key + '=' + currentHashParams[key];
    })
    .join('&');

  if (history.pushState) {
    history.pushState(null, null, '#?' + stringifiedParams);
  }
}


(function () {
  // get code from URL on first page-load
  const parsedParams = parseHashParams(location.hash);
  if (typeof parsedParams.code !== 'undefined') {
    editor.setValue(unescape(parsedParams.code));
  } else {
    editor.setValue(initialCode);
  }

  // re-render on changes
  editor.getSession().on('change', _.debounce(function (e) {
    renderToRoot();
  }, 300));

  // initial render
  renderToRoot();
})();
