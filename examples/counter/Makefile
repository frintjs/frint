PORT=5001

bundle:
	(cd ./core && npm run build)

serve:
	make bundle
	(cd ./build && ../../../node_modules/.bin/http-server -p $(PORT))
