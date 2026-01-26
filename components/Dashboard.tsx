import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft, RefreshCw, Zap, AlignLeft, ChevronDown, ChevronUp, AlertCircle, TrendingUp } from 'lucide-react'; // Added imported icons
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 } as any
  }
};

const Counter = ({ value, className }: { value: number, className?: string }) => {
  const spring = useSpring(0, { duration: 1500, bounce: 0 });
  const displayValue = useTransform(spring, (current) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(current)
  );

  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    spring.set(value);
    const unsubscribe = spring.on("change", (latest) => {
      if (latest === value) setHasEnded(true);
    });
    return unsubscribe;
  }, [value, spring]);

  return (
    <motion.h2
      className={`${className} ${hasEnded && value > 100 ? 'animate-pulse-red' : ''}`}
    >
      {displayValue}
    </motion.h2>
  );
};

// Typewriter Effect Component
const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 20); // Speed of typing
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayText}</span>;
}


export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Format currency helper (kept for tooltips/static text)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Aggregate categories for chart
  const categoryData = data.items.reduce((acc: any[], item) => {
    const existing = acc.find(x => x.name === item.category);
    if (existing) {
      existing.value += item.amount;
    } else {
      acc.push({ name: item.category, value: item.amount });
    }
    return acc;
  }, []);

  return (
    <motion.div
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        variants={itemVariants}
        onClick={onReset}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft size={18} /> Voltar para Upload
      </motion.button>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Custo Mensal</p>
          <Counter value={data.totalMonthly} className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 tracking-tight" />
          <div className="mt-2 text-xs text-slate-400">Total recorrente estimado</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Projeção Anual</p>
          <Counter value={data.totalYearly} className="text-3xl font-bold text-brand-600 mt-2" />
          <div className="mt-2 text-xs text-slate-400">Quanto você pagará em 12 meses</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Assinaturas</p>
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="text-4xl font-bold text-slate-900 mt-2"
          >
            {data.subscriptionCount}
          </motion.h2>
          <div className="mt-2 text-xs text-slate-400">Serviços identificados</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Detalhamento de Assinaturas</h3>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
              <AlignLeft size={12} /> IA Confidence High
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <SubscriptionRow key={idx} item={item} isHighlighted={activeCategory === item.category} />
            ))}
          </div>
        </motion.div>

        {/* Charts & Insights */}
        <div className="space-y-6">
          {/* Chart */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col overflow-hidden relative">
            <h3 className="text-lg font-bold text-slate-800 mb-2 z-10 relative">Por Categoria (3D)</h3>

            <div className="absolute inset-0 top-10">
              <FinancialDonut3D
                data={categoryData.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }))}
                onHover={(name) => setActiveCategory(name)}
              />
            </div>

            {/* Legend (Bottom) */}
            <div className="mt-auto grid grid-cols-2 gap-2 text-xs relative z-10 pt-60 pointer-events-none">
              {/* Pointer events none on legend container to let clicks pass to canvas if needed, 
                  but actually canvas is behind. We push legend down or overlay it. 
                  Let's adjust layout to be clean. */}
            </div>

            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-2 text-xs z-10 pointer-events-none">
              {categoryData.map((entry, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-2 p-1 rounded transition-colors backdrop-blur-sm ${activeCategory === entry.name ? 'bg-white/80 shadow-sm' : ''}`}
                  animate={{ scale: activeCategory === entry.name ? 1.05 : 1 }}
                >
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className={`truncate ${activeCategory === entry.name ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                    {entry.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Insights Box */}
          <motion.div
            variants={itemVariants}
            className="relative bg-slate-900 p-6 rounded-2xl shadow-lg text-white overflow-hidden group"
          >
            {/* "Living" Aurora Background */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-500/20 via-purple-500/10 to-transparent opacity-30"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            />

            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="bg-white/20 p-1 rounded">💡</span> Insights da IA</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-1 rounded-full animate-pulse">Live Analysis</span>
              </h3>
              <ul className="space-y-4">
                {data.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-slate-300 leading-relaxed border-l-2 border-brand-500 pl-3">
                    <TypewriterText text={insight} delay={idx * 1.5} />
                  </li>
                ))}
              </ul>

              <button className="w-full mt-6 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]">
                Ver como economizar <TrendingUp size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const SubscriptionRow = ({ item, isHighlighted }: { item: any, isHighlighted: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`p-5 hover:bg-slate-50 transition-colors group cursor-pointer border-l-4 ${isHighlighted ? 'border-brand-500 bg-brand-50/10' : 'border-transparent'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-start gap-4 mb-3 sm:mb-0">
          <div className={`p-3 rounded-lg ${item.amount > 100 ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'
            }`}>
            {item.frequency === 'yearly' ? <RefreshCw size={20} /> : <Zap size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              {item.name}
              {item.amount > 100 && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">ALTO</span>
              )}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {item.category}
              </span>
              {item.frequency === 'yearly' && (
                <span className="text-xs text-orange-600 font-medium">Anual</span>
              )}
            </div>

          </div>
        </div>
        <div className="text-right">
          <span className="block text-lg font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
          </span>
          <span className="text-xs text-slate-400 capitalize">/{item.frequency === 'yearly' ? 'ano' : 'mês'}</span>
        </div>
      </div>

      {/* Expandable Insight Tip */}
      <AnimatePresence>
        {(isExpanded || item.recommendation) && ( // Show truncated or full? For now showing full on expand
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0.7 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <AlertCircle size={16} className="text-brand-500 mt-0.5 shrink-0" />
              <p>
                <span className="font-semibold text-brand-700">Dica da IA:</span>
                {isExpanded ? ` ${item.recommendation}` : ' Clique para ver a sugestão de economia...'}
              </p>
              <div className="ml-auto text-slate-400">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}