PORT=5003

bundle:
	(cd ./core && npm run build)
	(cd ./widget-foo && npm run build)
	(cd ./widget-bar && npm run build)

serve-only:
	(cd ./build && ../../../node_modules/.bin/http-server -p $(PORT))

serve:
	make bundle
	make serve-only
