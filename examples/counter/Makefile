PORT=5001

bundle:
	npm run build

serve:
	make bundle
	(cd ./build && ../node_modules/.bin/http-server -p $(PORT))
