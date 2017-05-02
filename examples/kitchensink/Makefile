PORT=5002

bundle-vendor:
	(cd vendors && ../node_modules/.bin/webpack)

bundle:
	npm run build

serve-only:
	(cd ./build && ../node_modules/.bin/http-server -p $(PORT))

serve:
	make bundle-vendor
	make bundle
	make serve-only
