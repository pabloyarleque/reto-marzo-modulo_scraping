import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data'); 


if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export function guardarProductos(productos, nombreArchivo = 'productos.json') {
    const filePath = path.join(dataDir, nombreArchivo); 
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2), 'utf-8');
    console.log(`📂 Datos guardados en ${filePath}`);
}