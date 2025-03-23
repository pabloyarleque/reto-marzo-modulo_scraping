import { createServer } from './config/server.js';
import { setupRoutes } from './routes/routes.js';

(async () => {
    const app = createServer();
    setupRoutes(app);

    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    });
})();