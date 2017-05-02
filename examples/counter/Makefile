PORT=5001

bundle-vendor:
	(cd vendors && ../node_modules/.bin/webpack)

bundle:
	npm run build

serve:
	make bundle-vendor
	make bundle
	(cd ./build && ../node_modules/.bin/http-server -p $(PORT))
