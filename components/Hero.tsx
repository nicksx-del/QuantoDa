import React from 'react';
import { ShieldCheck, TrendingDown, Search, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onLogin: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const badgeVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 } as any
  }
};

const wordVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 } as any
  }
};

const ghostVariants = {
  hidden: { filter: "blur(10px)", scale: 0.8, opacity: 0 },
  visible: {
    filter: "blur(0px)",
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" } as any
  }
};

export const Hero: React.FC<HeroProps> = ({ onLogin }) => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center pt-20">
      {/* Background Blobs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl -z-10"
      />

      <motion.div
        className="container mx-auto px-4 flex flex-col items-center text-center z-10 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Morphing Logo */}
        <motion.div
          layoutId="logo-main"
          className="flex items-center gap-3 mb-6"
        >
          <div className="bg-brand-500 text-white p-3 rounded-2xl shadow-xl shadow-brand-500/20">
            <Wallet size={42} className="stroke-[2.5px]" />
          </div>
          <span className="text-4xl font-bold tracking-tight text-slate-900">
            Quanto<span className="text-brand-600">Dá?</span>
          </span>
        </motion.div>

        {/* Badge */}
        <motion.div variants={badgeVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          IA Financeira v2.0
        </motion.div>

        {/* Headline */}
        <motion.h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          <motion.span variants={wordVariants} className="inline-block mr-3">Descubra</motion.span>
          <motion.span variants={wordVariants} className="inline-block mr-3">assinaturas</motion.span>
          <motion.span
            variants={ghostVariants}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-emerald-700 mr-3"
          >
            fantasmas
          </motion.span>
          <br className="hidden md:block" />
          <motion.span variants={wordVariants} className="inline-block mr-3">e</motion.span>
          <motion.span variants={wordVariants} className="inline-block mr-3">pare</motion.span>
          <motion.span variants={wordVariants} className="inline-block mr-3">de</motion.span>
          <motion.span variants={wordVariants} className="inline-block mr-3">perder</motion.span>
          <motion.span variants={wordVariants} className="inline-block">dinheiro.</motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          O QuantoDá analisa seus extratos bancários com Inteligência Artificial para identificar gastos recorrentes esquecidos. Recupere o controle do seu dinheiro hoje.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mt-8">
          <MagneticButton onClick={onLogin} />
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left max-w-5xl w-full">
          <FeatureCard
            icon={<ShieldCheck className="text-brand-500" size={32} />}
            title="100% Privado"
            desc="Não pedimos senhas bancárias. A análise é feita via upload de arquivo e descartada instantaneamente."
            delay={0.2}
          />
          <FeatureCard
            icon={<Search className="text-blue-500" size={32} />}
            title="Detecção Inteligente"
            desc="Nossa IA separa o que é gasto essencial do que é assinatura recorrente que você esqueceu."
            delay={0.4}
          />
          <FeatureCard
            icon={<TrendingDown className="text-orange-500" size={32} />}
            title="Economia Real"
            desc="Usuários economizam em média R$ 350/ano cancelando serviços que não usam mais."
            delay={0.6}
          />
        </div>

      </motion.div>
    </section>
  );
};


const MagneticButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden bg-brand-600 hover:bg-brand-700 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-500/30 group"
    >
      <span className="relative z-10 flex items-center gap-2">
        <Search size={22} className="stroke-[3px]" />
        Analisar meus gastos grátis
      </span>
      {/* Shimmer Effect */}
      <motion.div
        className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
        animate={{ left: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, repeatDelay: 5, duration: 1.5, ease: "easeInOut" }}
      />
    </motion.button>
  )
}

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, type: "spring", bounce: 0.3 }}
      whileHover={{ y: -5, borderColor: "rgba(16, 185, 129, 0.4)" }}
      className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-6 p-3 bg-slate-50 rounded-2xl w-fit">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  )
}