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

const editor = ace.edit('editor');
editor.setTheme('ace/theme/chrome');
editor.getSession().setMode('ace/mode/javascript');
editor.setValue(initialCode);

editor.getSession().on('change', function (e) {
  renderToRoot();
});

function renderToRoot() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));

  const input = editor.getValue();
  const output = Babel.transform(input, {
    presets: [
      'es2015',
      'react',
    ]
  }).code;

  eval(output);
}

renderToRoot();
