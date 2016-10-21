# Contributing

## Pull Requests

When merging Pull Requests on GitHub, use the [squash and merge](https://github.com/blog/2141-squash-your-commits) button, so that our timeline of master branch is linear.

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

Or via Makefile:

```
$ make release VERSION=patch
```

## Changelogs

Changelogs are generated using the `github_changelog_generator` gem.

Make sure you have Ruby v2+:

```
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
$ curl -sSL https://get.rvm.io | bash -s stable

$ rvm install 2.2.2
```

Then install the gem:

```
$ gem install github_changelog_generator
```

Now you can generate `CHANGELOG.md` file automatically by running:

```
$ github_changelog_generator -t "YOUR_GITHUB_TOKEN"
```

You can generate a token [here](https://github.com/settings/tokens/new?description=GitHub%20Changelog%20Generator%20token)

Since this is a public repository, you only need `public_repo` access for the token.
