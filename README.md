# API Recetas (NestJS + PostgreSQL + imágenes locales)

Proyecto backend de práctica del grupo **Ladrillos**: **"Construyendo el futuro del desarrollo web, un ladrillo a la vez"**.

Este proyecto sigue el enfoque de **Senior Cat**: construir cimientos claros y avanzar por capas. Por eso la API está separada por módulos, controlador, servicio, DTO y entidad.

---

## 1) Objetivo

Construir una API de recetas con:

- CRUD completo de recetas.
- Subida de imagen local en carpeta `files/`.
- Guardado de enlace público en PostgreSQL (`image_url`) para consumo directo desde frontend.

---

## 2) Stack

- NestJS
- TypeORM (ORM)
- PostgreSQL (`pg`)
- `class-validator` / `class-transformer`
- Multer para archivos (`@nestjs/platform-express`)
- Config por variables de entorno (`@nestjs/config`)

---

## 3) Estructura del proyecto

```text
api-recetas/
├─ files/                                # imágenes locales (se crea automáticamente)
├─ postman/
│  └─ api-recetas.postman_collection.json
├─ scripts/
│  ├─ 00_create_database.sql
│  ├─ 01_create_tables.sql
│  ├─ 02_seed_recipes.sql
│  ├─ 03_crud_examples.sql
│  └─ 04_add_image_url_column.sql
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  └─ recipes/
│     ├─ dto/
│     │  ├─ create-recipe.dto.ts
│     │  └─ update-recipe.dto.ts
│     ├─ entities/
│     │  └─ recipe.entity.ts
│     ├─ recipes.controller.ts
│     ├─ recipes.module.ts
│     └─ recipes.service.ts
├─ .env
└─ .env.example
```

---

## 4) Arquitectura NestJS (qué hace cada pieza)

### 4.1 `Module`
- Agrupa una funcionalidad completa.
- Aquí: `RecipesModule` reúne controller + service + repositorio de `Recipe`.

### 4.2 `Controller`
- Recibe HTTP (`GET`, `POST`, `PATCH`, `DELETE`).
- Aquí: define rutas `/recipes` y `/recipes/:id/image`.

### 4.3 `Service`
- Contiene lógica de negocio y acceso a datos.
- Aquí: CRUD, validación de existencia y asociación de imagen.

### 4.4 `DTO`
- Define forma y reglas del payload de entrada.
- Aquí: `CreateRecipeDto` y `UpdateRecipeDto`.

### 4.5 `Entity`
- Mapea clase TypeScript <-> tabla SQL.
- Aquí: `Recipe` mapea a `public.recipes`.

### 4.6 Validación global
- En `main.ts`, `ValidationPipe` aplica validación para todos los endpoints.

---

## 5) ¿Qué es un ORM? (explicado claro)

**ORM** significa **Object-Relational Mapping**.

En vez de escribir SQL manual en cada endpoint, trabajas con objetos/clases y el ORM se encarga de traducir eso a SQL real.

### Ventajas prácticas

- Menos SQL repetido en controladores.
- Código más mantenible y legible.
- Menor probabilidad de errores de concatenación SQL.
- Integración directa con TypeScript (tipado de entidades y DTOs).

### Trade-off

- Tienes menos control fino que con SQL puro en casos muy avanzados.
- Aun así, para CRUD y APIs de aprendizaje es ideal.

---

## 6) Cómo consulta PostgreSQL esta API (sin SQL manual en controller/service)

Las consultas no están escritas como `SELECT ...` en archivos TS porque las genera TypeORM.

### Flujo real

1. Llega request al controller.
2. Controller llama al service.
3. Service usa `Repository<Recipe>`.
4. TypeORM traduce método a SQL.
5. PostgreSQL ejecuta y devuelve resultado.

### Métodos TypeORM que usamos y qué SQL generan

#### `create(dto)`
- Crea objeto entidad en memoria.
- **No ejecuta SQL** todavía.

#### `save(entity)`
- Inserta o actualiza según estado de la entidad.
- En creación suele equivaler a `INSERT INTO ... RETURNING ...`.
- En actualización suele equivaler a `UPDATE ... WHERE id = ...`.

#### `find({ order: { id: 'ASC' } })`
- Equivale a `SELECT * FROM recipes ORDER BY id ASC`.

#### `findOne({ where: { id } })`
- Equivale a `SELECT * FROM recipes WHERE id = $1 LIMIT 1`.

#### `merge(entity, dto)`
- Mezcla datos en memoria.
- **No ejecuta SQL** por sí solo.

#### `remove(entity)`
- Equivale a `DELETE FROM recipes WHERE id = ...`.

---

## 7) Logging SQL activado (para ver consultas reales)

Ya está activado mediante variable de entorno:

```env
DB_LOGGING=true
```

Está configurado en `app.module.ts` usando TypeORM `logging`.

### Qué verás en consola

Al ejecutar requests, Nest/TypeORM imprimirá consultas como:

- `query: SELECT ... FROM "recipes" ...`
- `query: INSERT INTO "recipes" ...`
- `query: UPDATE "recipes" ...`
- `query: DELETE FROM "recipes" ...`

Si quieres silenciarlo en algún momento:

```env
DB_LOGGING=false
```

---

## 8) Variables de entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=api_recetas_db
APP_URL=http://localhost:3000
DB_LOGGING=true
```

`APP_URL` se usa para construir `image_url` al subir una imagen.

---

## 9) PostgreSQL: scripts y propósito

### `00_create_database.sql`
- Crea la base `api_recetas_db`.

### `01_create_tables.sql`
- Crea tabla `public.recipes` con columna `image_url`.

### `02_seed_recipes.sql`
- Inserta recetas iniciales de prueba.

### `03_crud_examples.sql`
- Ejemplos SQL manuales de CRUD.

### `04_add_image_url_column.sql`
- Agrega `image_url` si la tabla ya existía antes de esta mejora.

---

## 10) Ejecutar scripts de DB

```powershell
$env:PGPASSWORD='1234'
psql -h localhost -U postgres -f .\scripts\00_create_database.sql
psql -h localhost -U postgres -d api_recetas_db -f .\scripts\01_create_tables.sql
psql -h localhost -U postgres -d api_recetas_db -f .\scripts\02_seed_recipes.sql
psql -h localhost -U postgres -d api_recetas_db -f .\scripts\04_add_image_url_column.sql
Remove-Item Env:PGPASSWORD
```

Verificar:

```powershell
$env:PGPASSWORD='1234'
psql -h localhost -U postgres -d api_recetas_db -c "SELECT id, nombre, image_url FROM public.recipes ORDER BY id;"
Remove-Item Env:PGPASSWORD
```

---

## 11) Endpoints

Base URL: `http://localhost:3000`

### CRUD recetas

1. `POST /recipes`
2. `GET /recipes`
3. `GET /recipes/:id`
4. `PATCH /recipes/:id`
5. `DELETE /recipes/:id`

### Imagen

6. `POST /recipes/:id/image`
- `multipart/form-data`
- Campo de archivo: `image`

7. `GET /files/:filename`
- Servido estáticamente desde carpeta `files/`.

---

## 12) Flujo de imagen completo

1. Frontend sube archivo a `POST /recipes/:id/image`.
2. Multer guarda archivo físico en `files/`.
3. Service construye URL pública: `${APP_URL}/files/<archivo>`.
4. TypeORM guarda esa URL en `recipes.image_url`.
5. Frontend renderiza `<img src="image_url" />`.

---

## 13) Colección Postman

Archivo listo para importar:

- `postman/api-recetas.postman_collection.json`

Incluye:
- 5 endpoints CRUD.
- Endpoint de subida de imagen.
- Variables: `baseUrl`, `recipeId`, `imagePath`.

---

## 14) Troubleshooting rápido

### “Cannot find module './recipes.service'”
- Revisar `tsconfig` en modo Nest estándar (`commonjs` + `node`).
- Reiniciar TypeScript Server de VS Code si el error persiste visualmente.

### No veo logs SQL
- Verifica `DB_LOGGING=true`.
- Reinicia servidor (`npm run start:dev`).

### `column image_url does not exist`
- Ejecuta `scripts/04_add_image_url_column.sql`.

### Puerto 3000 ocupado
- Cierra proceso que usa el puerto o cambia `PORT`.

---

## 15) Checklist final

- [ ] DB creada y tabla `recipes` disponible.
- [ ] Columna `image_url` existente.
- [ ] API levantada.
- [ ] SQL logging visible en consola.
- [ ] CRUD funcional.
- [ ] Subida de imagen funcional.
- [ ] URL pública accesible desde navegador/frontend.
