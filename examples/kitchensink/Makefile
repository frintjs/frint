PORT=5002

bundle:
	make bundle-frint
	(cd ./core && npm run build)
	(cd ./widget-counter && npm run build)
	(cd ./widget-color && npm run build)
	(cd ./widget-todos && npm run build)
	(cd ./widget-reversed && npm run build)

bundle-frint:
	(cd ../../ && npm run dist:lib)
	(cp ../../dist/frint.js ./build/js/frint.js)

serve-only:
	(cd ./build && ../../../node_modules/.bin/http-server -p $(PORT))

serve:
	make bundle
	make serve-only
