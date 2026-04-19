#!/bin/bash
set -e

# ============================================================
# dropbox-service/docker-up.sh — build local + run
# Uso: bash docker-up.sh
# ============================================================

IMAGE="dropbox-service"
CONTAINER="dropbox-service-dev"
PORT="5002:8080"
NETWORK="microservices-net"
ENV_FILE="/opt/coactivas/backend/.env"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }

[ -f "$ENV_FILE" ] || err "No se encontró $ENV_FILE\n  Ejecuta: nano $ENV_FILE"

# Red Docker
if ! docker network inspect "$NETWORK" >/dev/null 2>&1; then
  log "Creando red $NETWORK..."
  docker network create "$NETWORK"
fi

# Detener contenedor anterior
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  warn "Deteniendo contenedor anterior $CONTAINER..."
  docker stop "$CONTAINER" && docker rm "$CONTAINER"
fi

# Build local
log "Construyendo imagen $IMAGE..."
docker build -t "$IMAGE" .

# Run
log "Iniciando $CONTAINER..."
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  --network "$NETWORK" \
  -p "$PORT" \
  --env-file "$ENV_FILE" \
  "$IMAGE"

log "$CONTAINER corriendo → puerto externo 5002"
