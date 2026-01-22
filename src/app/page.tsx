'use client';

import { BarChart3, Tag, Lightbulb, CloudUpload } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen font-sans bg-[#E0FBE2] text-slate-800 flex flex-col items-center py-16 px-4 selection:bg-teal-200">

            {/* Header Section */}
            <header className="text-center mb-12 space-y-4 max-w-3xl">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3 mb-4">
                    💸 O que gastei?
                </h1>
                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                    Arraste extratos e faturas de <span className="text-[#0D9488] font-bold">qualquer banco</span>.<br />
                    Seja Nubank, Itaú, Bradesco, etc, em <span className="font-bold text-slate-900">PDF</span> ou <span className="font-bold text-slate-900">CSV</span>: nossa IA entende e organiza tudo automaticamente!
                </p>
                <p className="text-xs text-slate-400 font-medium pt-2">
                    Pode enviar até 2 arquivos de uma vez! (De preferência, utilize CSV).
                </p>
            </header>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-slate-700 hover:shadow-md transition-shadow cursor-default">
                    <BarChart3 className="w-5 h-5 text-purple-500" /> Gráficos Visuais
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-slate-700 hover:shadow-md transition-shadow cursor-default">
                    <Tag className="w-5 h-5 text-orange-500" /> Categorização Automática
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-slate-700 hover:shadow-md transition-shadow cursor-default">
                    <Lightbulb className="w-5 h-5 text-yellow-500" /> Conselhos Financeiros
                </div>
            </div>

            {/* Main Upload Card */}
            <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl p-8 md:p-12">
                <div className="flex flex-col gap-8">

                    {/* Upload Zone */}
                    <div className="border-2 border-dashed border-[#99F6E4] bg-transparent rounded-[1.5rem] h-60 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50/30 hover:border-teal-400 transition-all duration-300 group">
                        <div className="mb-5 transform group-hover:scale-110 transition-transform duration-300">
                            <CloudUpload className="w-16 h-16 text-[#5EEAD4]" strokeWidth={2} />
                        </div>

                        <h3 className="text-base font-bold text-slate-800 mb-1">
                            Clique para selecionar os CSVs ou PDFs
                        </h3>
                        <p className="text-slate-400 text-xs font-medium">
                            Máximo de 2 arquivos por análise
                        </p>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-lg py-5 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all active:translate-y-[0px]">
                        Analisar Gastos
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center text-slate-400/80 text-xs font-medium max-w-lg leading-relaxed">
                A inteligência artificial pode cometer erros. Sempre confira os valores com seus dados oficiais<br />
                &copy; 2026 QuantoDa
            </footer>

        </main>
    );
}
