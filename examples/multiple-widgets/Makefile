PORT=5003

bundle:
	(cd ./core && npm run build)
	(cd ./app-foo && npm run build)
	(cd ./app-bar && npm run build)

serve-only:
	(cd ./build && ../../../node_modules/.bin/http-server -p $(PORT))

serve:
	make bundle
	make serve-only
