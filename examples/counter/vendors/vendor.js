// react-dom
(function () {
  var m = require('react-dom');
  if (typeof m.default !== 'undefined') {
    window['ReactDOM'] = m.default;
    return;
  }
  window['ReactDOM'] = m;
})();

// react
(function () {
  var m = require('react');
  if (typeof m.default !== 'undefined') {
    window['React'] = m.default;
    return;
  }
  window['React'] = m;
})();

// rxjs
(function () {
  var m = require('rxjs');
  if (typeof m.default !== 'undefined') {
    window['Rx'] = m.default;
    return;
  }
  window['Rx'] = m;
})();

// frint
(function () {
  var m = require('frint');
  if (typeof m.default !== 'undefined') {
    window['Frint'] = m.default;
    return;
  }
  window['Frint'] = m;
})();

// frint-react
(function () {
  var m = require('frint-react');
  if (typeof m.default !== 'undefined') {
    window['FrintReact'] = m.default;
    return;
  }
  window['FrintReact'] = m;
})();

// frint-store
(function () {
  var m = require('frint-store');
  if (typeof m.default !== 'undefined') {
    window['FrintStore'] = m.default;
    return;
  }
  window['FrintStore'] = m;
})();
