PORT=5001

bundle:
	(cd ./core && npm run build)

serve:
	make bundle
	for pkg in `ls -d ../../packages/*/`;                               \
	do                                                                  \
		[[ ! -d "$$pkg/dist" ]] && (cd $$pkg; npm run dist);              \
		cp $$pkg/dist/*.min.js build;                                     \
	done;
	(cd ./build && ../../../node_modules/.bin/http-server -p $(PORT))
