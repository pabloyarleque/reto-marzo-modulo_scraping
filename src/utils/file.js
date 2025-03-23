import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data'); // Ruta a la carpeta data

// Verificar si la carpeta "data" existe, si no, crearla
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export function guardarProductos(productos, nombreArchivo = 'productos.json') {
    const filePath = path.join(dataDir, nombreArchivo); // Ruta completa del archivo
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2), 'utf-8');
    console.log(`📂 Datos guardados en ${filePath}`);
}