const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export async function convertirImagenABase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`❌ Error descargando imagen: ${response.statusText}`);

        const buffer = Buffer.from(await response.arrayBuffer());
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error("⚠️ Error al convertir imagen:", error);
        return null;
    }
}