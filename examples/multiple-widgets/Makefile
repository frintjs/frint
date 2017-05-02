PORT=5003

bundle:
	npm install
	npm run build

serve-only:
	(cd ./build && ../node_modules/.bin/http-server -p $(PORT))

serve:
	make bundle
	make serve-only
