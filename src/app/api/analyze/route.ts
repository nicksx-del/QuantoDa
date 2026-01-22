import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is missing in process.env");
      return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const prompt = `Você é um analista financeiro experiente.
    
    CONTEXTO:
    Você receberá um texto que pode ser um EXTRATO BANCÁRIO em formato CSV (valores separados por vírgula ou ponto e vírgula) ou Texto Livre.
    
    SEU OBJETIVO:
    Ler o conteúdo, identificar as colunas (Data, Descrição/Histórico, Valor) e separar o que são GASTOS DE ASSINATURAS RECORRENTES.
    
    PROCESSAMENTO DE CSV:
    1. Se o texto parecer um CSV, identifique qual coluna é a "DESCRIÇÃO" e qual é o "VALOR".
    2. Ignore colunas de Data, ID, ou Saldo.
    3. Se os valores estiverem com sinal negativo (ex: -29.90), converta para positivo.
    
    CRITÉRIOS DE FILTRAGEM:
    - IDENTIFICAR: Netflix, Spotify, Amazon Prime, YouTube Premium, Adobe, Apple, Google Storage, Microsoft 365, Academias (SmartFit, Bluefit), OpenAI, Cursos recorrentes.
    - IGNORAR: Pix enviados/recebidos, Uber, iFood, Mercado, Padaria, Farmácia, Saques, Transferências entre contas.
    
    SAÍDA ESPERADA (JSON ESTRITO):
    Retorne APENAS um JSON válido com o seguinte formato:
    {
      "subscriptions": [
        { 
          "name": "Nome do Serviço (Limpo, ex: 'Netflix' ao invés de 'DEB EM CONTA NETFLIX')", 
          "amount": 0.00, 
          "category": "Streaming / Educação / Software / Lazer" 
        }
      ],
      "total_monthly": 0.00,
      "savings_tips": [
        "Dica 1 baseada nos gastos encontrados...",
        "Dica 2...",
        "Dica 3..."
      ]
    }
    
    TEXTO PARA ANÁLISE:
    ===================
    ${text.slice(0, 20000)}
    ===================
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const data = JSON.parse(jsonString);
      return NextResponse.json(data);
    } catch (e) {
      console.error("JSON Parse Error", jsonString);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

  } catch (error) {
    console.error("AI Error", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
