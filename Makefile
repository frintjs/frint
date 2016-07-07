VERSION := patch

release:
	echo "Releasing version: $(VERSION)"
	git checkout master
	git pull origin master
	npm run transpile
	npm version $(VERSION)
	npm publish
	git push --follow-tags
	npm run docs:publish
