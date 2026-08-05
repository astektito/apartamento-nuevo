# apartamento-nuevo

Tarjeta de felicitación interactiva hecha con Next.js para celebrar la mudanza a un nuevo apartamento. Al tocar el sobre se abre la tarjeta, suena una canción y aparecen un ramo de tulipanes, un mensaje y una galería de fotos. Incluye un corazón secreto 💛 que revela una **cuponera** de regalos reclamables, cuyo estado se comparte entre dispositivos gracias a una base de datos.

Es un proyecto personal/de aprendizaje, sencillo y de una sola página.

## Tecnologias

- Next.js 14 (App Router)
- React 18
- JavaScript (sin TypeScript)
- CSS puro (`app/globals.css`)
- Animaciones y flores en SVG/CSS, más audio HTML5
- [Upstash Redis](https://upstash.com/) como base de datos (estado compartido de los cupones)

## Como ejecutar

Requiere Node.js. Desde la raíz del proyecto:

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:3000)
npm run build    # compilar para producción
npm run start    # servir la versión de producción
```

La app funciona sin base de datos (usa `localStorage` como respaldo). Para
activar el estado compartido entre dispositivos, ver la sección siguiente.

## Base de datos (cuponera compartida)

Los cupones reclamados se guardan en Redis para que se vea el mismo estado
desde cualquier dispositivo. Sin credenciales configuradas, la app cae
elegantemente a `localStorage` (solo local).

**Variables de entorno** (ver `.env.example`):

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Configurar en Vercel:**

1. Proyecto → **Storage** → **Create Database** → **Upstash for Redis**.
2. **Connect Project** para inyectar las variables automáticamente.
3. Redeploy para que el despliegue tome las credenciales.

**Desarrollo local:**

```bash
vercel env pull .env.local   # baja las credenciales del proyecto
```

**Reiniciar la cuponera a cero:** borra la clave `cupones-reclamados` desde el
Data Browser o la CLI de Upstash (`DEL cupones-reclamados`).

## API

- `GET /api/cupones` → `{ "reclamados": [0, 2, ...] }` — índices ya reclamados.
- `POST /api/cupones` con body `{ "indice": 0 }` → marca ese cupón como reclamado.

## Estructura

```
app/
  layout.js            # layout raíz y metadatos
  page.js              # tarjeta interactiva (textos configurables en CONFIG)
  globals.css          # estilos y animaciones
  api/
    cupones/route.js   # API de la cuponera (Redis + respaldo local)
public/
  fotos/               # imágenes de la galería y portada de la cuponera
  malibu.mp3           # música de fondo
next.config.mjs        # configuración de Next.js
jsconfig.json          # alias de importación (@/*)
.env.example           # variables de entorno de ejemplo
```

Los textos, la música, las fotos y los cupones se personalizan en el objeto
`CONFIG` al inicio de `app/page.js`.

Autor: Edwin Astudillo
