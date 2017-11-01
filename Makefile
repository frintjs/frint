FROM_TAG := ""
TO_TAG := ""
GITHUB_API_TOKEN := ""

##
# Releases
release:
	npm run dist
	./node_modules/.bin/lerna publish --force-publish=*

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

list-dists:
	@echo "original \\t gzipped \\t file"
	@echo "--- \\t\\t --- \\t\\t ---"
	@ls -alh ./packages/frint*/dist/*.js | grep '.min.js' | awk '{print $$9 }' | while read LINE; do\
		SIZE="$$(cat $${LINE} | wc -c | bc)";\
		SIZE_IN_KB=$$(echo "scale=1; $${SIZE} / 1024" | bc);\
		GZIPPED_SIZE="$$(gzip -c $${LINE} | wc -c | bc)";\
		GZIPPED_SIZE_IN_KB=$$(echo "scale=1; $${GZIPPED_SIZE} / 1024" | bc);\
		echo "$${SIZE_IN_KB}K \\t\\t $${GZIPPED_SIZE_IN_KB}K \\t\\t $${LINE}";\
	done

##
# REPL
#
repl-update-dists:
	npm run dist
	cp -rf ./packages/frint*/dist/ ./repl/js/

repl-serve-only:
	./node_modules/.bin/live-server --port=6002 ./repl

repl-serve:
	make repl-update-dists
	make repl-serve-only

##
# Usage stats
#
define list_usage_in_source
	find ./packages -iname "*.js" | grep "/src/" | grep -v -e ".spec.js" -e "/node_modules/" | xargs cat | grep $(1) | sort -u
endef

list-usage-rxjs:
	@$(call list_usage_in_source,'rxjs/')

list-usage-lodash:
	@$(call list_usage_in_source,'lodash/')
