bundle:
	make bundle-frint
	make bundle-example

bundle-example:
	(cd ./core && npm run build)
	(cd ./widget-counter && npm run build)
	(cd ./widget-color && npm run build)
	(cd ./widget-todos && npm run build)
	(cd ./widget-reversed && npm run build)

bundle-frint:
	(cd ../../ && npm run dist)
	make copy-frint

copy-frint:
	(cp ../../packages/frint/dist/frint.js ./build/js/frint.js)
	(cp ../../packages/frint-model/dist/frint-model.js ./build/js/frint-model.js)
	(cp ../../packages/frint-store/dist/frint-store.js ./build/js/frint-store.js)
	(cp ../../packages/frint-react/dist/frint-react.js ./build/js/frint-react.js)

serve-only:
	(cd ./build && ../../../node_modules/.bin/http-server -p 5002)

serve:
	make bundle
	make serve-only
