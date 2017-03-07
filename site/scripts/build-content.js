const fs = require('fs');

const _ = require('lodash');
const Metalsmith = require('metalsmith');
const marked = require('marked');

const views = {
  layouts: {},
  partials: {},
};

function loadLayout(name) {
  views.layouts[name] = _.template(fs.readFileSync(__dirname + '/../layouts/' + name + '.html'));
}

function loadPartial(name) {
  views.partials[name] = _.template(fs.readFileSync(__dirname + '/../partials/' + name + '.html'));
}

loadLayout('default');
loadLayout('home');
loadPartial('assets');
loadPartial('navLinks');
loadPartial('footer');

Metalsmith(__dirname)
  .source(__dirname + '/../content')
  .destination(__dirname + '/../../_site')

  // buffer to string - please don't judge me
  .use(function (files, metalsmith, done) {
    _.each(files, function (obj, file) {
      files[file].contents = obj.contents.toString();
    });
    done();
  })

  // markdown
  .use(function convertMarkdown(files, metalsmith, done) {
    _.each(files, function (obj, file) {
      files[file].contents = marked(obj.contents);
    });
    done();
  })

  // layout
  .use(function applyLayout(files, metalsmith, done) {
    _.each(files, function (obj, file) {
      const layoutName = obj.layout || 'default';
      files[file].contents = views.layouts[layoutName](Object.assign({}, obj, {
        renderPartial: function (partialName) {
          return views.partials[partialName]();
        }
      }));
    });
    done();
  })

  // url - filepath
  .use(function urls(files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      const content = files[file];
      const newKey = file
        .replace('README.md', 'index.md')
        .replace('.md', '.html')
      files[newKey] = content;
      delete files[file];
    });

    done();
  })

  // string to buffer - please don't judge me
  .use(function (files, metalsmith, done) {
    _.each(files, function (obj, file) {
      files[file].contents = new Buffer(obj.contents);
    });
    done();
  })

  // build
  .build(function (err) {
    if (err) {
      throw err;
    }

    console.log('Built successfully');
  });
