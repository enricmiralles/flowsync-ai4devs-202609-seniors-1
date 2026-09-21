.PHONY: setup start

BACKEND_DIR := backend
FRONTEND_DIR := frontend

setup:
	@echo "==> Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install
	@echo "==> Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		echo "==> Creating backend/.env from .env.example..."; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
	fi
	@if ! grep -q '^APP_KEY=.\+' $(BACKEND_DIR)/.env; then \
		echo "==> Generating APP_KEY..."; \
		cd $(BACKEND_DIR) && node ace generate:key; \
	fi
	@echo "==> Running migrations..."
	cd $(BACKEND_DIR) && node ace migration:run

start:
	@trap 'kill 0' EXIT INT TERM; \
	(cd $(BACKEND_DIR) && npm run dev) & \
	(cd $(FRONTEND_DIR) && npm run dev) & \
	wait
