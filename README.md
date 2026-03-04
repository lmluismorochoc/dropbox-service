# Dropbox Microservice — NestJS Clean Architecture

Microservicio REST para gestión de archivos en **Dropbox** usando NestJS con Clean Architecture.

## Requisitos previos

1. Node.js >= 18
2. Cuenta de Dropbox con una App configurada en [App Console](https://www.dropbox.com/developers/apps)
3. Permisos requeridos en la App:
   - `files.content.write`
   - `files.content.read`
   - `files.metadata.read`

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Edita .env y coloca tu DROPBOX_ACCESS_TOKEN
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints

Base URL: `http://localhost:3000/api/v1`

### `POST /files/upload`
Sube un archivo en base64 a una carpeta de Dropbox.

**Body (JSON):**
```json
{
  "folder": "/mi-carpeta",
  "fileName": "documento.pdf",
  "base64Content": "SGVsbG8gV29ybGQ="
}
```

**Respuesta 201:**
```json
{
  "message": "Archivo subido exitosamente",
  "file": {
    "path": "/mi-carpeta/documento.pdf",
    "name": "documento.pdf",
    "size": 1234,
    "clientModified": "2026-03-04T10:00:00Z",
    "serverModified": "2026-03-04T10:00:01Z"
  }
}
```

---

### `GET /files/list?folder=/mi-carpeta`
Lista los archivos de una carpeta.

**Query params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `folder` | string | Ruta de la carpeta (ej: `/mi-carpeta`) |

**Respuesta 200:**
```json
{
  "total": 2,
  "files": [
    { "path": "/mi-carpeta/archivo1.txt", "name": "archivo1.txt", "size": 512, ... }
  ]
}
```

---

### `GET /files/download?path=/mi-carpeta/archivo.pdf`
Descarga un archivo y lo retorna en base64.

**Respuesta 200:**
```json
{
  "path": "/mi-carpeta/archivo.pdf",
  "base64Content": "SGVsbG8gV29ybGQ="
}
```

---

### `DELETE /files?path=/mi-carpeta/archivo.pdf`
Elimina un archivo de Dropbox.

**Respuesta 200:**
```json
{
  "message": "Archivo '/mi-carpeta/archivo.pdf' eliminado exitosamente"
}
```

## Estructura del proyecto (Clean Architecture)

```
src/
├── domain/                     # Entidades e interfaces (sin dependencias externas)
│   ├── entities/
│   │   └── file.entity.ts
│   └── repositories/
│       └── file-storage.repository.interface.ts
├── application/                # Casos de uso y DTOs
│   ├── dtos/
│   └── use-cases/
├── infrastructure/             # Adaptadores externos (Dropbox SDK)
│   └── dropbox/
│       └── dropbox-file-storage.repository.ts
└── presentation/               # Controllers y Módulos NestJS
    ├── controllers/
    └── modules/
```
