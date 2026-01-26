import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';

const ShimmerBlock = ({ className }: { className: string }) => {
    return (
        <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
        </div>
    );
};

export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="relative w-full">
            {/* Overlay Message */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-md text-center"
                >
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                        <BrainCircuit className="text-brand-600 z-10" size={32} />
                        {/* Pulse Effect */}
                        <motion.div
                            className="absolute inset-0 bg-brand-200/50 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Analisando Extrato
                    </h3>
                    <p className="text-slate-600 mb-6">
                        Nossa IA está procurando assinaturas escondidas e categorizando seus gastos...
                    </p>

                    <div className="flex items-center gap-2 justify-center text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <Sparkles size={14} />
                        <span>A IA pode cometer erros. Verifique os valores.</span>
                    </div>
                </motion.div>
            </div>

            {/* Blurred Skeleton Background */}
            <div className="space-y-8 pb-12 w-full animate-pulse-fast opacity-50 pointer-events-none filter blur-sm select-none">
                {/* Header Placeholder */}
                <div className="h-6 w-32 bg-slate-200 rounded-md mb-8"></div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-32 flex flex-col justify-between">
                            <ShimmerBlock className="h-4 w-24 rounded" />
                            <ShimmerBlock className="h-10 w-32 rounded" />
                            <ShimmerBlock className="h-3 w-40 rounded" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main List Skeleton */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <ShimmerBlock className="h-6 w-48 rounded" />
                        </div>
                        <div className="divide-y divide-slate-100 p-6 space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <ShimmerBlock className="w-12 h-12 rounded-lg" />
                                        <div className="space-y-2">
                                            <ShimmerBlock className="h-5 w-32 rounded" />
                                            <ShimmerBlock className="h-3 w-20 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex flex-col items-end">
                                        <ShimmerBlock className="h-6 w-24 rounded" />
                                        <ShimmerBlock className="h-3 w-12 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Charts & Insights Skeleton */}
                    <div className="space-y-6">
                        {/* Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
                            <ShimmerBlock className="h-6 w-32 rounded mb-6" />
                            <div className="flex-grow flex items-center justify-center">
                                <ShimmerBlock className="w-40 h-40 rounded-full" />
                            </div>
                        </div>

                        {/* Insights Box */}
                        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg h-48 flex flex-col gap-4">
                            <div className="h-6 w-32 bg-slate-800 rounded"></div>
                            <div className="space-y-2">
                                <div className="h-3 w-full bg-slate-800 rounded"></div>
                                <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                                <div className="h-3 w-4/6 bg-slate-800 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
