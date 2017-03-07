var lib = require('./lib');

global.resetDOM = lib.resetDOM;
global.resetDOM();

lib.takeOverConsole(console);
