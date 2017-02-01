bundle:
	(cd ./core && npm run build)
	(cd ./widget-counter && npm run build)
	(cd ./widget-color && npm run build)

serve-only:
	(cd ./build && ../../../node_modules/.bin/http-server -p 5002)

serve:
	make bundle
	make serve-only
