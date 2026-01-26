// @ts-ignore
import satori, { init } from 'satori/standalone';
import initYoga from 'yoga-wasm-web';
// @ts-ignore
import yogaWasm from 'yoga-wasm-web/dist/yoga.wasm?url';
import { ShareableCard } from '../components/ShareableCard';
import React from 'react';

// Singleton to avoid re-initializing
let yogaInitialized = false;

const initSatori = async () => {
    if (yogaInitialized) return;

    try {
        const yoga = await initYoga(await fetch(yogaWasm).then(res => res.arrayBuffer()));
        init(yoga);
        yogaInitialized = true;
    } catch (e) {
        console.error("Failed to init Yoga WASM:", e);
        throw new Error("Falha ao inicializar motor gráfico.");
    }
};

const fetchFont = async () => {
    // Roboto Mono Regular
    const response = await fetch('https://fonts.gstatic.com/s/robotomono/v22/L0x5DF4xlVMF-BfR8bXMIjhLq3-cXbKDO1w.woff');
    if (!response.ok) throw new Error("Failed to fetch font");
    return await response.arrayBuffer();
};

export const generateAndDownloadReceipt = async (data: any) => {
    try {
        await initSatori();
        const fontData = await fetchFont();

        const svg = await satori(
            <ShareableCard
                data={data}
                date={new Date().toLocaleDateString('pt-BR')}
            />,
            {
                width: 600,
                height: 800,
                fonts: [
                    {
                        name: 'Roboto Mono',
                        data: fontData,
                        weight: 400,
                        style: 'normal',
                    },
                ],
            }
        );

        const img = new Image();
        const svg64 = btoa(unescape(encodeURIComponent(svg)));
        const image64 = 'data:image/svg+xml;base64,' + svg64;

        img.src = image64;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error("Could not create canvas context");

        ctx.fillStyle = '#ffffff';
        // We fill a rect to ensure white background if transparency issues occur
        // But ShareableCard has a transparent wrapper and white card. 
        // Let's just draw the image.
        ctx.drawImage(img, 0, 0);

        const link = document.createElement('a');
        link.download = `recibo-quantoda-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

    } catch (e) {
        console.error("Error generating receipt details:", e);
        alert(`Erro ao gerar recibo: ${e instanceof Error ? e.message : "Erro desconhecido"}`);
    }
};
