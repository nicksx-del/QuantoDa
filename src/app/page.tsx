'use client';

import { useState, useRef } from 'react';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { Upload, Loader2, FileText, TrendingDown, DollarSign, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

type Subscription = {
    name: string;
    amount: number;
    category: string;
};

type AnalysisResult = {
    subscriptions: Subscription[];
    total_monthly: number;
    savings_tips: string[];
};

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setLoading(true);
        setResult(null);

        try {
            let text = '';

            // 1. Extração Client-Side (PDF ou CSV)
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                text = await extractTextFromPDF(file);
            } else if (
                file.type === 'text/csv' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.toLowerCase().endsWith('.csv')
            ) {
                text = await file.text();
            } else {
                throw new Error('Formato não suportado. Use PDF ou CSV.');
            }

            // 2. Análise Server-Side
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Falha na análise da IA');

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao processar seu extrato. Verifique se o arquivo é válido (PDF ou CSV).');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <main className="min-h-screen font-sans text-white bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">

                {/* Header Section */}
                <header className="text-center mb-16 space-y-6 animate-in slide-in-from-top-10 fade-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(34,211,238,0.3)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-xs font-semibold tracking-widest uppercase text-cyan-200">
                            Auditoria IA Premium v2.0
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl">
                        Quanto<span className="text-cyan-400 text-shadow-glow">Dá?</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        O futuro das suas finanças. Identifique <span className="text-white font-medium border-b border-cyan-500/30">assinaturas fantasmas</span> e otimize seu fluxo de caixa com inteligência artificial de ponta.
                    </p>
                </header>

                {/* Upload Zone (Glassmorphism + Neon) */}
                {!result && !loading && (
                    <div className="relative group w-full max-w-md aspect-square">
                        {/* Glow Effect Layer */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                        <div
                            className="relative h-full w-full bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 cursor-pointer overflow-hidden transition-all duration-300 group-hover:scale-[1.01] group-hover:border-cyan-500/30"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept=".pdf,.csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />

                            {/* Grid Pattern Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                            <div className="relative z-10 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl border border-white/5 shadow-2xl mb-6 group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] transition-all duration-300">
                                <Upload className="h-10 w-10 text-cyan-400" />
                            </div>

                            <h3 className="relative z-10 text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
                                Upload do Extrato
                            </h3>
                            <p className="relative z-10 text-slate-500 text-sm font-medium tracking-wide uppercase">
                                Aceitamos PDF e CSV
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State with Cyberpunk/Tech feel */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                            <Loader2 className="h-20 w-20 text-cyan-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                        </div>
                        <h2 className="mt-8 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                            Processando Dados
                        </h2>
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <span className="text-xs font-mono text-cyan-500/70 uppercase tracking-[0.2em] animate-pulse">
                                Descriptografando transações...
                            </span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="w-full max-w-lg bg-red-950/30 backdrop-blur-md border border-red-500/30 text-red-200 p-8 rounded-2xl flex items-center gap-6 mt-8 animate-in slide-in-from-bottom-5">
                        <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/20">
                            <TrendingDown className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white mb-1">Erro de Processamento</h3>
                            <p className="text-sm opacity-80 mb-4">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white transition-colors"
                            >
                                [ Tentar Novamente ]
                            </button>
                        </div>
                    </div>
                )}

                {/* Dashboard Results (Futuristic Dashboard) */}
                {result && (
                    <div className="w-full max-w-6xl space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">

                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-white tracking-tight">Relatório de Auditoria</h2>
                            </div>
                            <button
                                onClick={() => { setResult(null); setError(null); }}
                                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all font-medium text-slate-300 hover:text-white"
                            >
                                <Upload className="h-4 w-4 group-hover:-translate-y-1 transition-transform text-cyan-500" />
                                Nova Análise
                            </button>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Total Monthly */}
                            <div className="col-span-1 md:col-span-2 relative group overflow-hidden bg-[#0d121f] rounded-[2rem] border border-white/5 p-8">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-cyan-400 mb-4">
                                        <Activity className="h-5 w-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300/50">Fluxo Recorrente</span>
                                    </div>
                                    <div>
                                        <p className="text-6xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-lg">
                                            {formatCurrency(result.total_monthly)}
                                        </p>
                                        <p className="text-slate-500 mt-2 font-light">Comprometimento mensal estimado</p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Count */}
                            <div className="relative bg-[#0d121f] rounded-[2rem] border border-white/5 p-8 flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/10">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">{new Date().toLocaleDateString('pt-BR')}</span>
                                </div>
                                <p className="text-5xl font-bold text-white mb-2">{result.subscriptions.length}</p>
                                <p className="text-slate-400 font-medium">Assinaturas Ativas</p>
                            </div>
                        </div>

                        {/* Main Table (Cyberpunk List) */}
                        <div className="bg-[#0d121f] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" /> Detalhamento de Gastos
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-8 py-5">Serviço</th>
                                            <th className="px-8 py-5">Categoria</th>
                                            <th className="px-8 py-5 text-right">Valor Mensal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {result.subscriptions.map((sub, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                                        <span className="font-semibold text-white text-lg">{sub.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-cyan-200 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                                                        {sub.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right font-mono text-xl text-white tracking-tight">{formatCurrency(sub.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {result.subscriptions.length === 0 && (
                                <div className="p-16 text-center">
                                    <ShieldCheck className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 text-lg">Nenhuma assinatura detectada.</p>
                                </div>
                            )}
                        </div>

                        {/* AI Insights (Glowing Cards) */}
                        {result.savings_tips.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="md:col-span-2 mb-2">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-purple-400" /> Insights de Otimização
                                    </h3>
                                </div>
                                {result.savings_tips.map((tip, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-[#111827] to-[#0a0f1c] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                                0{idx + 1}
                                            </div>
                                            <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors pt-1">
                                                {tip}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="h-20"></div> {/* Bottom Spacing */}
                    </div>
                )}
            </div>
        </main>
    );
}
