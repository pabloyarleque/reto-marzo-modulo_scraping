import puppeteer from 'puppeteer';
import { analizarImagenGemini } from '../services/EmpaqueIA.js';
import { guardarProductos } from '../utils/file.js';

export async function scrapeTottus() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    let productos = [];

    // URL de la primera página
    const urlBase = 'https://tottus.falabella.com.pe/tottus-pe/category/cat13380487/Despensa?subdomain=tottus&page=1&store=tottus';
    await page.goto(urlBase, { waitUntil: 'networkidle2' });

    // 📌 Obtener el número total de páginas
    const totalPages = await page.evaluate(() => {
        const paginationButtons = [...document.querySelectorAll('.pagination-item-mkp')];
        const lastPageButton = paginationButtons[paginationButtons.length - 1];
        return lastPageButton ? parseInt(lastPageButton.innerText.trim(), 10) : 1;
    });

    console.log(`📌 Se detectaron ${totalPages} páginas en la categoría.`);

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const page = await browser.newPage(); // Abre nueva pestaña
        const url = `https://tottus.falabella.com.pe/tottus-pe/category/cat13380487/Despensa?subdomain=tottus&page=${currentPage}&store=tottus`;
        console.log(`📄 Abriendo pestaña para la página: ${currentPage}`);

        await page.goto(url, { waitUntil: 'networkidle2' });

        // 📌 Hacer scroll hasta el final de la página para cargar imágenes
        let prevHeight = 0;
        while (true) {
            let newHeight = await page.evaluate(() => {
                window.scrollBy(0, 1000);
                return document.body.scrollHeight;
            });

            if (newHeight === prevHeight) break;
            prevHeight = newHeight;

            await new Promise(resolve => setTimeout(resolve, 1500)); // ⏳ Espera tras scroll
        }

        // 📌 Forzar carga de imágenes lazy-load
        await page.evaluate(() => {
            document.querySelectorAll('img').forEach(img => {
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src'); // Mueve data-src a src
                }
            });
        });

        // 📌 Asegurar que todas las imágenes están visibles antes de extraer datos
        await page.waitForSelector('.jsx-1996933093 img', { visible: true });
        try {
            await page.waitForFunction(() => {
                return [...document.querySelectorAll('.jsx-1996933093 img')]
                    .every(img => img.complete && img.naturalHeight > 0);
            }, { timeout: 60000 }); 
        } catch (error) {
            console.warn(`⚠️ Advertencia: No se pudieron cargar todas las imágenes en la página ${currentPage}`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000)); // ⏳ Espera extra para carga

        // 📌 Extraer datos de productos
        const productosPagina = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.pod-link')).map(producto => ({
                nombre: producto.querySelector('.pod-subTitle')?.innerText.trim(),
                marca: producto.querySelector('.jsx-3451706699')?.innerText.trim(),
                imagen: producto.querySelector('.jsx-1996933093 img')?.src || 
                        producto.querySelector('.jsx-1996933093 img')?.getAttribute('data-src'),
                categoria: document.querySelector('h1.l2category')?.innerText.trim(),
                subcategoria: document.querySelector('a.l1category')?.innerText.trim(),
            }));
        });

        // 📌 Verificar imágenes antes de enviarlas a la IA
        await Promise.all(productosPagina.map(async (producto) => {
            if (!producto.imagen || !producto.imagen.startsWith("http")) {
                console.warn(`⚠️ Imagen no válida para: ${producto.nombre}`);
                producto.es_flexible = null;
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // ⏳ Espera antes de análisis
            producto.es_flexible = await analizarImagenGemini(producto.imagen);
        }));

        productos = productos.concat(productosPagina);
        console.log(`✅ Página ${currentPage}: ${productosPagina.length} productos procesados`);

        await page.close(); // Cierra la pestaña después de procesar la página
    }

    try {
        guardarProductos(productos);
        return productos; 
    } finally {
        await browser.close();
        console.log("✅ Scraping completado. Cerrando proceso...");
        process.exit(0);
    }
}