import React from 'react';
import { ShieldCheck, TrendingDown, Search, ArrowRight } from 'lucide-react';

interface HeroProps {
  onLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-20 text-center space-y-8">
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-xs font-semibold uppercase tracking-wider mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
        </span>
        IA Financeira v2.0
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl">
        Descubra assinaturas <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-emerald-700">fantasmas</span> e pare de perder dinheiro.
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
        O QuantoDá analisa seus extratos bancários com Inteligência Artificial para identificar gastos recorrentes esquecidos. Recupere o controle do seu dinheiro hoje.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
        <button 
          onClick={onLogin}
          className="bg-brand-600 hover:bg-brand-700 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Analisar meus gastos grátis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left max-w-5xl w-full">
        <FeatureCard 
          icon={<ShieldCheck className="text-brand-500" size={32} />}
          title="100% Privado"
          desc="Não pedimos senhas bancárias. A análise é feita via upload de arquivo e descartada instantaneamente."
        />
        <FeatureCard 
          icon={<Search className="text-blue-500" size={32} />}
          title="Detecção Inteligente"
          desc="Nossa IA separa o que é gasto essencial do que é assinatura recorrente que você esqueceu."
        />
        <FeatureCard 
          icon={<TrendingDown className="text-orange-500" size={32} />}
          title="Economia Real"
          desc="Usuários economizam em média R$ 350/ano cancelando serviços que não usam mais."
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);