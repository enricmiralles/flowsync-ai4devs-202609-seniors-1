.PHONY: setup start

setup:
	cd backend && npm install
	cd frontend && npm install
	test -f backend/.env || cp backend/.env.example backend/.env
	grep -q '^APP_KEY=.\+' backend/.env || (cd backend && node ace generate:key)
	cd backend && node ace migration:run

start:
	@trap 'kill 0' INT TERM; \
	(cd backend && npm run dev) & \
	(cd frontend && npm run dev) & \
	wait
