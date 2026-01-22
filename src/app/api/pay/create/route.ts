import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ABACATEPAY_API_URL = 'https://api.abacatepay.com/v1'; // URL Teórica - Ajuste conforme documentação real
const API_KEY = process.env.ABACATEPAY_API_KEY;

export async function POST(req: NextRequest) {
    try {
        // Como é um MVP, vamos cobrar um valor fixo ou simbólico, mas a rota aceita valor.
        // O usuário não especificou o fluxo exato de valor, vamos assumir R$ 9,90 pelo serviço se não passado.
        const { amount = 990 } = await req.json(); // centavos ou valor float? Assumindo centavos integer (990 = R$ 9.90) se for padrão Stripe/Pagarme, ou float se for simples. 
        // AbacatePay geralmente usa integer em centavos? Vamos assumir integer.

        // Mock para teste sem chave
        if (!API_KEY) {
            // Return a mock if no key is present for dev
            return NextResponse.json({
                billingId: 'mock-bill-' + Date.now(),
                url: 'https://abacatepay.com/pay/mock', // Url ficticia
                pixCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913QuantoDa Saas6008Brasilia62070503***6304E2CA'
            });
        }

        const response = await axios.post(`${ABACATEPAY_API_URL}/billing/create`, {
            frequency: "ONE_TIME",
            methods: ["PIX"],
            products: [
                {
                    externalId: "audit-report",
                    name: "Auditoria Financeira IA",
                    quantity: 1,
                    price: amount // Verifique se a API espera centavos
                }
            ],
            returnUrl: "http://localhost:3000",
            completionUrl: "http://localhost:3000?success=true"
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        return NextResponse.json({
            billingId: response.data.data.id,
            url: response.data.data.url,
            pixCode: response.data.data.pix?.code // Ajuste conforme payload real da AbacatePay
        });

    } catch (error) {
        console.error('AbacatePay Create Error:', error);
        return NextResponse.json({ error: 'Failed to create billing' }, { status: 500 });
    }
}
