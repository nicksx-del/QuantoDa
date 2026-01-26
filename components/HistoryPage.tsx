import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, YAxis } from 'recharts';
import { AnalysisResult } from '../types';
import { ArrowLeft, Clock, TrendingDown, TrendingUp, Minus, Calendar, ChevronRight } from 'lucide-react';

interface HistoryPageProps {
    history: AnalysisResult[];
    onBack: () => void;
    onViewDetail: (item: AnalysisResult) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onBack, onViewDetail }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Process Data for Sparkline (chrono order)
    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
    }, [history]);

    const chartData = sortedHistory.map(h => ({
        date: new Date(h.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'short' }),
        value: h.totalMonthly
    }));

    // Calculate Trend
    const firstValue = sortedHistory[0]?.totalMonthly || 0;
    const lastValue = sortedHistory[sortedHistory.length - 1]?.totalMonthly || 0;
    const totalSavings = firstValue - lastValue;
    const isSaving = totalSavings > 0;

    // Toggle Compare Selection
    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(i => i !== id));
        } else {
            if (selectedItems.length < 2) {
                setSelectedItems(prev => [...prev, id]);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Trend Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">Minha Linha do Tempo</h1>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">
                                Tendência Geral
                            </p>
                            <div className="flex items-baseline gap-3">
                                <h2 className="text-3xl font-bold text-slate-900">
                                    {isSaving ? 'Economia de ' : 'Aumento de '}
                                    <span className={isSaving ? 'text-emerald-600' : 'text-red-600'}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(totalSavings))}
                                    </span>
                                </h2>
                                <span className="text-sm text-slate-400">desde o início</span>
                            </div>
                        </div>

                        {/* Sparkline */}
                        <div className="h-16 w-full md:w-64 max-w-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={isSaving ? '#10b981' : '#ef4444'}
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: isSaving ? '#10b981' : '#ef4444' }}
                                        activeDot={{ r: 5 }}
                                    />
                                    {/* Hide Axes for Sparkline look */}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Container */}
            <div className="container mx-auto px-4 py-12 max-w-3xl relative">

                {/* Vertical Line Animation */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-8 md:left-1/2 top-12 bottom-12 w-0.5 bg-slate-200 -translate-x-1/2 md:-translate-x-px"
                />

                <div className="space-y-12">
                    {/* Render items in Reverse Chronological (Newest first) */}
                    {[...sortedHistory].reverse().map((item, index, arr) => {
                        // Calculate Delta vs Previous (which is actually next in this reversed array, or properly found in sorted array)
                        // Getting correct prevItem from the original sorted array logic
                        const originalIndex = sortedHistory.findIndex(x => x.id === item.id);
                        const prevItem = originalIndex > 0 ? sortedHistory[originalIndex - 1] : null;

                        const delta = prevItem ? item.totalMonthly - prevItem.totalMonthly : 0;
                        const isBetter = delta <= 0;
                        const isDiff = delta !== 0;

                        return (
                            <TimelineCard
                                key={item.id || index}
                                item={item}
                                delta={delta}
                                isBetter={isBetter}
                                isDiff={isDiff}
                                index={index}
                                isLast={index === arr.length - 1} // Actually first chronologically
                                onSelect={() => item.id && toggleSelection(item.id)}
                                isSelected={!!item.id && selectedItems.includes(item.id)}
                                onViewDetail={() => onViewDetail(item)}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Comparison Floating Action Button */}
            <AnimatePresence>
                {selectedItems.length === 2 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => alert("Funcionalidade de Comparação: Em breve!")}
                    >
                        <span className="font-bold">Comparar 2 meses</span>
                        <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-xs font-bold">
                            VS
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface TimelineCardProps {
    item: AnalysisResult;
    delta: number;
    isBetter: boolean;
    isDiff: boolean;
    index: number;
    isLast: boolean;
    onSelect: () => void;
    isSelected: boolean;
    onViewDetail: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, delta, isBetter, isDiff, index, isLast, onSelect, isSelected, onViewDetail }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Date / Label Side */}
            <div className="w-full md:w-1/2 flex justify-start md:justify-end px-4 md:px-0 pl-16 md:pl-0">
                <div className={`text-left ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-start md:justify-end">
                        <Calendar size={14} />
                        {new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Center Dot */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-slate-200 rounded-full z-10 shadow-sm" />

            {/* Card Content Side */}
            <div className="w-full md:w-1/2 pl-16 md:pl-0 pr-4 md:pr-0">
                <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={onViewDetail}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer relative group overflow-hidden
                        ${isSelected ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 hover:shadow-md'}
                    `}
                >
                    {/* Comparison Checkbox */}
                    <div
                        className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }} // Controlled by onClick parent
                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Total Mensal</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalMonthly)}
                            </h3>
                        </div>

                        {/* Delta Badge */}
                        {isDiff ? (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${isBetter ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                {isBetter ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(delta))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-500">
                                <Minus size={14} /> Estável
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        <span className="text-xs text-slate-400">
                            {item.subscriptionCount} assinaturas detectadas
                        </span>
                        <span className="text-brand-600 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                            Ver Detalhes <ChevronRight size={16} />
                        </span>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};
