const fs = require('fs');

const _ = require('lodash');
const Metalsmith = require('metalsmith');
const marked = require('marked');
const yaml = require('js-yaml');

/**
 * Views
 */
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

fs.readdirSync(__dirname + '/../layouts').forEach(function (file) {
  loadLayout(file.replace('.html', ''));
});

fs.readdirSync(__dirname + '/../partials').forEach(function (file) {
  loadPartial(file.replace('.html', ''));
});

/**
 * Data
 */
const data = {};

fs.readdirSync(__dirname + '/../data').forEach(function (file) {
  const yamlContent = fs.readFileSync(__dirname + '/../data/' + file);
  const parsedYaml = yaml.safeLoad(yamlContent);
  const key = file.split('/').pop().replace('.yml', '');

  data[key] = parsedYaml;
});

/**
 * Build
 */
Metalsmith(__dirname)
  .source(__dirname + '/../content')
  .destination(__dirname + '/../../_site')

  // ignore files
  .use(function (files, metalsmith, done) {
    _.each(files, function (obj, file) {
      if (!file.endsWith('.md')) {
        delete files[file];
      }
    });

    done();
  })

  // buffer to string - please don't judge me
  .use(function (files, metalsmith, done) {
    _.each(files, function (obj, file) {
      files[file].contents = obj.contents.toString();
    });
    done();
  })

  // importContent
  .use(function (files, metalsmith, done) {
    _.each(files, function (obj, file) {
      // from package
      if (typeof obj.importContentFromPackage !== 'undefined') {
        const packageName = obj.importContentFromPackage;

        try {
          const packageReadme = fs.readFileSync(__dirname + '/../../packages/' + packageName + '/README.md');
          files[file].contents = files[file].contents + packageReadme;
        } catch (e) {
          console.log('Could not import content from: ' + packageName);
        }
      }

      // from root
      if (typeof obj.importContentFromRoot !== 'undefined') {
        const rootFile = obj.importContentFromRoot;

        try {
          const rootFileContent = fs.readFileSync(__dirname + '/../../' + rootFile);
          files[file].contents = files[file].contents + rootFileContent;
        } catch (e) {
          console.log('Could not import content from root: ' + rootFile);
        }
      }
    });
    done();
  })

  // markdown
  .use(function convertMarkdown(files, metalsmith, done) {
    _.each(files, function (obj, file) {
      console.log('Markdown: ' + file);

      const contents = obj.processTemplate
        ? _.template(obj.contents)(Object.assign(
          {},
          obj,
          { data: data }
        ))
        : obj.contents;

      files[file].contents = marked(contents);
    });
    done();
  })

  // layout
  .use(function applyLayout(files, metalsmith, done) {
    _.each(files, function (obj, file) {
      console.log('Rendering:', file);

      const layoutName = obj.layout || 'default';
      files[file].contents = views.layouts[layoutName](Object.assign({}, obj, {
        data: data,
        renderPartial: function (partialName) {
          return views.partials[partialName]({
            data: data
          });
        }
      }));
    });
    done();
  })

  // url
  .use(function urls(files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      const content = files[file];
      const newKey = file
        .replace('README.md', 'index.md')
        .replace('index.md', 'index.html')
        .replace('.md', '.html');

      if (newKey.indexOf('/index.html') > -1) {
        files[newKey] = content;
      } else {
        files[newKey.replace('.html', '/index.html')] = content;
      }

      delete files[file];
    });

    done();
  })

  // string to buffer - please don't judge me
  .use(function (files, metalsmith, done) {
    _.each(files, function (obj, file) {
      // bug fix with index.html
      let newFile = file;
      if (file.indexOf('index/index.html') > -1) {
        newFile = file.replace('index/index.html', 'index.html')
        files[newFile] = obj;
        delete files[file];
      }

      files[newFile].contents = new Buffer(obj.contents);
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
