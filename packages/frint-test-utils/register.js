var lib = require('./lib');

global.resetDOM = lib.resetDOM;
global.resetDOM();

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({
  adapter: new Adapter(),
});

lib.takeOverConsole(console);
