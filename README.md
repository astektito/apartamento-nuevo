# apartamento-nuevo

Tarjeta de felicitación interactiva hecha con Next.js para celebrar la mudanza a un nuevo apartamento. Al tocar el sobre se abre la tarjeta, suena una canción y aparecen un ramo de tulipanes, un mensaje y una galería de fotos.

Es un proyecto personal/de aprendizaje, sencillo y de una sola página.

## Tecnologias

- Next.js 14 (App Router)
- React 18
- JavaScript (sin TypeScript)
- CSS puro (`app/globals.css`)
- Animaciones y flores en SVG/CSS, más audio HTML5

## Como ejecutar

Requiere Node.js. Desde la raíz del proyecto:

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:3000)
npm run build    # compilar para producción
npm run start    # servir la versión de producción
```

## Estructura

```
app/
  layout.js      # layout raíz y metadatos
  page.js        # tarjeta interactiva (textos configurables en CONFIG)
  globals.css    # estilos y animaciones
public/
  fotos/         # imágenes de la galería
  malibu.mp3     # música de fondo
next.config.mjs  # configuración de Next.js
jsconfig.json    # alias de importación (@/*)
```

Los textos, la música y las fotos se personalizan en el objeto `CONFIG` al inicio de `app/page.js`.

Autor: Edwin Astudillo
