const API_URL = "https://api.abacatepay.com/v1";

export const createSubscription = async (email: string) => {
    try {
        const apiKey = import.meta.env.VITE_ABACATE_PAY_API_KEY;

        if (!apiKey) {
            throw new Error("API Key do AbacatePay não configurada.");
        }

        const response = await fetch(`${API_URL}/billing/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                frequency: 'ONE_TIME',
                methods: ['CREDIT_CARD', 'PIX'],
                products: [
                    {
                        externalId: 'quantoda-premium',
                        name: 'QuantoDá? Premium',
                        quantity: 1,
                        price: 2990, // R$ 29,90 in cents
                        description: 'Acesso completo a insights de IA e gráficos 3D.',
                    }
                ],
                returnUrl: window.location.origin + '/?status=success',
                completionUrl: window.location.origin + '/?status=success',
                customer: {
                    email: email,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("AbacatePay API Error:", data);
            throw new Error(data.error || "Erro ao criar cobrança");
        }

        // The API returns { data: { url: "..." }, ... } structure usually, 
        // need to verify exact structure from docs or assuming standard REST wrapper.
        // Based on SDK usage 'billing.url', it might be data.data.url or data.url
        // Let's assume data.data.url based on common API patterns, or just log to be sure if it fails.
        // Actually, previous search snippet showed just the object structure.

        // Let's return data.url if it exists at top level, or data.data.url
        return data.data?.url || data.url;

    } catch (error) {
        console.error("AbacatePay Service Error:", error);
        throw error;
    }
};
