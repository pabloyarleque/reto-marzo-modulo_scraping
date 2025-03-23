<h1>Web Scraping de Productos de Despensa</h1>
Proyecto realiza scraping de productos de la categoría 'Despensa' en Tottus, extrayendo información como nombre, marca, imagen y categorías. Además, analiza si el empaque es flexible utilizando la API de Gemini.

<h2>Tecnologías utilizadas</h2>

Node.js 

Express 

Puppeteer 

node-fetch 

Dotenv 

<h2>Instalación:</h2>

```sh
npm install
```

<h2>Uso:</h2>

para ejecutar el server 

```sh
node src/index.js
```

Si todo está bien, verás el siguiente mensaje en consola:

```sh
🚀 Servidor Express escuchando en http://localhost:8080
```

Para scrapear productos, en el navegador:

```sh
http://localhost:8080
```

## ¿Cómo funciona?

### 1. Scraping de Tottus con Puppeteer

- Se abre la URL de la categoría "Despensa" en Tottus.
- Se obtiene el número total de páginas.
- Se navega por cada página, extrayendo datos de los productos:
  - **Nombre**
  - **Marca**
  - **Imagen (URL)**
  - **Categoría**
  - **Subcategoría**
- Se asegura que las imágenes estén completamente cargadas antes de extraer la información.

### 2. Análisis de imágenes con Gemini AI

- Se convierte la imagen a **Base64**.
- Se envía la imagen a la **API de Gemini** junto con la consulta:  
  *"Analiza la imagen proporcionada y determina si el empaque es flexible o rígido.Un empaque flexible es aquel hecho de materiales como plástico delgado, bolsas resellables, papel aluminio o films plásticos. Un empaque rígido es aquel que mantiene su forma, como botellas de plástico grueso, cajas de cartón o frascos de vidrio.¿Es este empaque flexible?"*.
- Se recibe una respuesta que indica si el empaque es **flexible** o **no**.

### 3. Almacenamiento de datos

- Los productos extraídos y su análisis son guardados en un archivo **JSON** en la carpeta `data/`.

### 4. Servidor Express

- El servidor **Express** expone una ruta en `/` que ejecuta el scraping y devuelve los datos en formato **JSON**.


