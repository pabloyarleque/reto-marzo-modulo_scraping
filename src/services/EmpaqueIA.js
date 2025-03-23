const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import { convertirImagenABase64 } from '../utils/images.js';
import { GEMINI_API_URL, GEMINI_API_KEY} from '../config/config.js';

export async function analizarImagenGemini(urlImagen) {
    const imagenBase64 = await convertirImagenABase64(urlImagen);
    if (!imagenBase64) return false;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Analiza la imagen proporcionada y determina si el empaque es flexible o rígido.Un empaque flexible es aquel hecho de materiales como plástico delgado, bolsas resellables, papel aluminio o films plásticos. Un empaque rígido es aquel que mantiene su forma, como botellas de plástico grueso, cajas de cartón o frascos de vidrio.¿Es este empaque flexible?" },
                        { inlineData: { mimeType: "image/jpeg", data: imagenBase64.split(',')[1] } }
                    ]
                }]
            })
        });

        const resultado = await response.json();
        return resultado?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase().includes("sí") ?? false;
    } catch (error) {
        console.error("⚠️ Error en la solicitud a Gemini:", error);
        return false;
    }
}