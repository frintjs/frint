const exec = require('execa');

const createApp = require('frint').createApp;

const descriptionText = `
Usage:

  $ frint init
  $ frint init --example exampleName

Example:

  $ mkdir my-new-directory
  $ cd my-new-directory

  $ frint init --example kitchensink

You can find list of all available examples here:
https://github.com/Travix-International/frint/tree/master/examples
`.trim();

module.exports = createApp({
  name: 'init',
  providers: [
    {
      name: 'summary',
      useValue: 'Scaffolds a new Frint app in current working directory',
    },
    {
      name: 'description',
      useValue: descriptionText,
    },
    {
      name: 'execute',
      useFactory: function useFactory(deps) {
        return function execute() {
          const example = deps.params.example || 'counter';
          const dir = deps.pwd;

          const cmds = [
            `mkdir -p ${dir}`,
            `curl https://codeload.github.com/Travix-International/frint/tar.gz/master | tar -xz -C ${dir} --strip=3 frint-master/examples/${example}`,
          ];

          deps.console.log('Initializing...');
          const cmdPromises = cmds.map(cmd => exec.shell(cmd));

          Promise.all(cmdPromises)
            .then(() => deps.console.log('Done!'))
            .catch(e => deps.console.error(e));
        };
      },
      deps: [
        'console',
        'params',
        'pwd',
      ],
    }
  ],
});
