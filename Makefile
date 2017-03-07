FROM_TAG := ""
TO_TAG := ""
GITHUB_API_TOKEN := ""

release:
	npm run dist
	./node_modules/.bin/lerna publish

release-canary:
	npm run dist
	./node_modules/.bin/lerna publish --canary

changelog:
	git checkout master
	git pull origin master
	GITHUB_AUTH=$(GITHUB_API_TOKEN) ./node_modules/.bin/lerna-change --tag-from $(FROM_TAG) --tag-to $(TO_TAG)

push-changelog:
	git checkout master
	git pull origin master
	git add CHANGELOG.md
	git commit -m 'changelog updated.'
	git push origin master

list-packages:
	./node_modules/.bin/lerna ls

list-updated:
	./node_modules/.bin/lerna updated
