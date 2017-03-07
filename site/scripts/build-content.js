const Metalsmith = require('metalsmith');
const marked = require('marked');

Metalsmith(__dirname)
  .source(__dirname + '/../content')
  .destination(__dirname + '/../../site')

  // markdown
  .use(function convertMarkdown() {
    return function plugin(files, metalsmith, done) {
      setImmediate(done);
      Object.keys(files).forEach(function (file) {
        console.log('file', file);
      });
    };
  })

  // build
  .build(function (err) {
    if (err) {
      throw err;
    }

    console.log('Built successfully');
  });
