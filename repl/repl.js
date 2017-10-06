const initialCode = `
// import
const { createApp } = Frint;
const { render, observe, streamProps } = FrintReact;
const { createStore, combineReducers } = FrintStore;

// constants
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// actions
function incrementCounter() {
  return {
    type: INCREMENT_COUNTER
  };
}

function decrementCounter() {
  return {
    type: DECREMENT_COUNTER
  };
}

// reducers
const INITIAL_STATE = {
  value: 0
};

function counterReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return Object.assign({}, {
        value: state.value + 1
      });

    case DECREMENT_COUNTER:
      return Object.assign({}, {
        value: state.value - 1
      });

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  counter: counterReducer,
});

// component
const Root = observe(function (app) {
  const store = app.get('store');

  return streamProps({})
    .set(
      store.getState$(),
      state => ({ counter: state.counter.value })
    )
    .setDispatch({
      increment: incrementCounter,
      decrement: decrementCounter,
    }, store)
    .get$();
})(function (props) {
  const { counter, increment, decrement } = props;

  return (
    <div>
      <p>Counter value: <code>{counter}</code></p>

      <div>
        <button
          className="button button-primary"
          onClick={() => increment()}
        >
          +
        </button>

        <button
          className="button"
          onClick={() => decrement()}
        >
          -
        </button>
      </div>
    </div>
  );
});

// App
const App = createApp({
  name: 'MyTestApp',
  providers: [
    {
      name: 'component',
      useValue: Root
    },
    {
      name: 'store',
      useFactory: ({ app }) => {
        const Store = createStore({
          initialState: {
            counter: {
              value: 5,
            }
          },
          reducer: rootReducer,
          deps: { app },
        });

        return new Store();
      },
      deps: ['app'],
    },
  ]
});

// render
const app = new App();
render(app, document.getElementById('root'));
`.trim();

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
