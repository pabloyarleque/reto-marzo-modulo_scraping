import { scrapeTottus } from '../services/scraper.js';

export function setupRoutes(app) {
    // Ruta para iniciar el scraping
    app.get('/', async (req, res) => {
        try {
            console.log("🚀 Iniciando scraping...");
            const productos = await scrapeTottus();
            res.json({ success: true, productos });
        } catch (error) {
            console.error("❌ Error en scraping:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
}