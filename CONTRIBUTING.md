# Contributing

## Releases

To publish a new release:

```
$ git checkout master
$ git pull origin master

$ npm run transpile
$ npm version patch(|minor|major)
$ npm publish
$ git push --follow-tags
$ npm run docs:publish
```
