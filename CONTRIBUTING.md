# Contributing

## Releases

To publish a new release:

```
$ npm run transpile
$ npm version patch(|minor|major)
$ npm publish
$ git push --follow-tags
$ npm run docs:publish
```
