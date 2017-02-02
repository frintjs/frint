bundle:
	(cd ./core && npm run build)
	(cd ./widget-counter && npm run build)
	(cd ./widget-color && npm run build)
	(cd ../../ && npm run dist:lib)
	(cp ../../dist/frint.js ./build/frint.js)

serve-only:
	(cd ./build && ../../../node_modules/.bin/http-server -p 5002)

serve:
	make bundle
	make serve-only
