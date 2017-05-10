PORT=5003

bundle:
	npm run build:apps

bundle-vendor:
	npm run build:vendors

serve-only:
	npm run serve-only

serve:
	make bundle-vendor
	make bundle
	make serve-only
