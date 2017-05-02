FROM_TAG := ""
TO_TAG := ""
GITHUB_API_TOKEN := ""

##
# Releases
release:
	npm run dist
	./node_modules/.bin/lerna publish

release-canary:
	npm run dist
	./node_modules/.bin/lerna publish --canary

##
# Changelog
changelog:
	git checkout master
	git pull origin master
	GITHUB_AUTH=$(GITHUB_API_TOKEN) ./node_modules/.bin/lerna-changelog --tag-from $(FROM_TAG) --tag-to $(TO_TAG)

push-changelog:
	git checkout master
	git pull origin master
	git add CHANGELOG.md
	git commit -m 'changelog updated.'
	git push origin master

##
# Packages
list-packages:
	./node_modules/.bin/lerna ls

list-updated:
	./node_modules/.bin/lerna updated

##
# Site
site-fetch-contributors:
	GITHUB_API_TOKEN=$(GITHUB_API_TOKEN) node ./site/scripts/fetch-contributors.js

site-build:
	node ./site/scripts/build-content.js

	mkdir -p ./_site/css
	./node_modules/.bin/node-sass --include-path ./node_modules ./site/assets/css/main.scss ./_site/css/site.css

	mkdir -p ./_site/js
	./node_modules/.bin/babel ./site/assets/js --out-dir ./_site/js

	cp -rf ./site/assets/img ./_site/img

	cp -rf ./packages/frint*/dist ./_site/js

site-watch:
	make site-build
	fswatch -or './site' | xargs -I{} make site-build

site-serve-only:
	echo "Starting server at http://localhost:6001"
	./node_modules/.bin/live-server --port=6001 ./_site/

site-serve:
	make site-build
	make site-serve-only

site-publish:
	npm run bootstrap
	npm run dist
	rm -rf ./_site
	make site-build
	make site-publish-only

site-publish-only:
	rm -rf ./_site/.git

	cp -f CNAME ./_site/CNAME

	(cd ./_site && git init)
	(cd ./_site && git commit --allow-empty -m 'update site')
	(cd ./_site && git checkout -b gh-pages)
	(cd ./_site && touch .nojekyll)
	(cd ./_site && git add .)
	(cd ./_site && git commit -am 'update site')
	(cd ./_site && git push git@github.com:Travix-International/frint gh-pages --force)

##
# Examples

serve-counter-example:
	(cd ./examples/counter && make serve)

serve-kitchensink-example:
	(cd ./examples/kitchensink && make serve)

serve-multiple-widgets-example:
	(cd ./examples/multiple-widgets && make serve)
