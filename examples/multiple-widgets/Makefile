PORT=5003

bundle:
	npm run build

bundle-vendor:
	(cd vendors && ../node_modules/.bin/webpack)

serve-only:
	(cd ./build && ../node_modules/.bin/http-server -p $(PORT))

serve:
	make bundle-vendor
	make bundle
	make serve-only
