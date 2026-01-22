import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ABACATEPAY_API_URL = 'https://api.abacatepay.com/v1';
const API_KEY = process.env.ABACATEPAY_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const { billingId } = await req.json();

        if (!API_KEY) {
            // Mock verification - always returns true for now in dev if no key
            // Or simula um delay: se billingId conter 'mock', retorna pago
            return NextResponse.json({ paid: true });
        }

        const response = await axios.get(`${ABACATEPAY_API_URL}/billing/list`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            },
            params: {
                id: billingId
            }
        });

        // Encontra o billing e checa status
        const billing = response.data.data.find((b: any) => b.id === billingId);

        const isPaid = billing?.status === 'PAID';

        return NextResponse.json({ paid: isPaid });

    } catch (error) {
        console.error('AbacatePay Check Error:', error);
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}
