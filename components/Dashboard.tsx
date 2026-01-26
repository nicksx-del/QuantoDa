import React from 'react';
import { AnalysisResult, SubscriptionItem } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowLeft, RefreshCw, AlertTriangle, Check, Zap } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  // Format currency
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
    <div className="space-y-8 pb-12">
      <button 
        onClick={onReset} 
        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft size={18} /> Voltar para Upload
      </button>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Custo Mensal</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(data.totalMonthly)}</h2>
          <div className="mt-2 text-xs text-slate-400">Total recorrente estimado</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Projeção Anual</p>
          <h2 className="text-3xl font-bold text-brand-600 mt-2">{formatCurrency(data.totalYearly)}</h2>
          <div className="mt-2 text-xs text-slate-400">Quanto você pagará em 12 meses</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Assinaturas</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{data.subscriptionCount}</h2>
          <div className="mt-2 text-xs text-slate-400">Serviços identificados</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Detalhamento de Assinaturas</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">IA Confidence High</span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4 mb-3 sm:mb-0">
                  <div className={`p-3 rounded-lg ${
                    item.amount > 100 ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'
                  }`}>
                    {item.frequency === 'yearly' ? <RefreshCw size={20} /> : <Zap size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                      {item.frequency === 'yearly' && (
                        <span className="text-xs text-orange-600 font-medium">Anual</span>
                      )}
                    </div>
                    {item.recommendation && (
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <span className="text-brand-600 font-semibold">Dica:</span> {item.recommendation}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-slate-900">{formatCurrency(item.amount)}</span>
                  <span className="text-xs text-slate-400 capitalize">/{item.frequency === 'yearly' ? 'ano' : 'mês'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts & Insights */}
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[300px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Por Categoria</h3>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="truncate text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded">💡</span> Insights da IA
            </h3>
            <ul className="space-y-3">
              {data.insights.map((insight, idx) => (
                <li key={idx} className="text-sm text-slate-200 leading-relaxed border-l-2 border-brand-500 pl-3">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};