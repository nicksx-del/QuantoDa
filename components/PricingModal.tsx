import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, Zap } from 'lucide-react';
import { createSubscription } from '../services/abacatePayService'; // Reuse service

interface PricingModalProps {
    onClose: () => void;
    onPurchase: () => void;
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: { opacity: 0 }
};

const modalVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300
        } as any
    },
    exit: {
        y: 50,
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onPurchase }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (email: string) => {
        try {
            setIsLoading(true);
            const checkoutUrl = await createSubscription(email);
            if (checkoutUrl) window.location.href = checkoutUrl;
        } catch (e) {
            console.error(e);
            alert("Erro ao iniciar pagamento.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 md:p-12 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-brand-100/50 rounded-2xl mb-6">
                            <Star className="w-8 h-8 text-brand-600 fill-brand-600" />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Desbloqueie análises ilimitadas
                        </h2>
                        <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
                            Recupere o controle total das suas finanças. Analise extratos complexos e cancele assinaturas fantasmas sempre que quiser.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Mensal</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors hover:bg-slate-300 focus:outline-none"
                            >
                                <motion.div
                                    className="w-6 h-6 bg-white rounded-full shadow-sm"
                                    animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                                Anual
                                <AnimatePresence>
                                    {billingCycle === 'yearly' && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold"
                                        >
                                            -20%
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* Basic Plan */}
                            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 opacity-75 hover:opacity-100 transition-opacity">
                                <h3 className="text-lg font-bold text-slate-700 mb-2">Avulso</h3>
                                <div className="text-3xl font-bold text-slate-900 mb-4">
                                    R$ 9,90<span className="text-sm font-medium text-slate-400">/análise</span>
                                </div>
                                <ul className="text-left space-y-3 mb-8 text-sm text-slate-600">
                                    <li className="flex items-center gap-2"><Check size={16} className="text-slate-400" /> 1 Análise Completa</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-slate-400" /> Acesso ao Dashboard 3D</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-slate-400" /> Exportação PDF</li>
                                </ul>
                                <button className="w-full py-3 rounded-xl border border-slate-300 font-semibold text-slate-600 hover:bg-white hover:border-slate-400 transition-all">
                                    Comprar 1 Crédito
                                </button>
                            </div>

                            {/* Pro Plan */}
                            <motion.div
                                className="p-1 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-blue-500 relative"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute top-0 right-0 p-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-white text-brand-600 p-1 rounded-full shadow-lg"
                                    >
                                        <Check size={16} strokeWidth={3} />
                                    </motion.div>
                                </div>

                                <div className="bg-white rounded-xl p-6 h-full relative overflow-hidden">
                                    {/* Shine effect */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>

                                    <h3 className="text-lg font-bold text-brand-600 mb-2 flex items-center justify-center gap-2">
                                        <Zap size={18} className="fill-brand-600" /> Pro Recorrente
                                    </h3>
                                    <div className="text-4xl font-bold text-slate-900 mb-1 flex items-center justify-center gap-1">
                                        <AnimatePresence mode="popLayout">
                                            <motion.span
                                                key={billingCycle}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                            >
                                                R$ {billingCycle === 'monthly' ? '29' : '24'}
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-sm font-medium text-slate-400">/mês</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-6">
                                        {billingCycle === 'yearly' ? 'Cobrado R$ 288 anualmente' : 'Cobrado mensalmente'}
                                    </p>

                                    <ul className="text-left space-y-3 mb-8 text-sm text-slate-700">
                                        <li className="flex items-center gap-2"><div className="bg-brand-100 p-0.5 rounded-full"><Check size={14} className="text-brand-600" /></div> Análises Ilimitadas</li>
                                        <li className="flex items-center gap-2"><div className="bg-brand-100 p-0.5 rounded-full"><Check size={14} className="text-brand-600" /></div> Monitoramento Contínuo</li>
                                        <li className="flex items-center gap-2"><div className="bg-brand-100 p-0.5 rounded-full"><Check size={14} className="text-brand-600" /></div> Dicas Personalizadas de IA</li>
                                        <li className="flex items-center gap-2"><div className="bg-brand-100 p-0.5 rounded-full"><Check size={14} className="text-brand-600" /></div> Suporte Prioritário</li>
                                    </ul>

                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            // Prompt for email for now, in real app usage auth context
                                            const email = prompt("Digite seu e-mail para assinar:");
                                            if (email) handleSubscribe(email);
                                        }}
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? "Processando..." : "Assinar Agora"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        <button onClick={onClose} className="mt-8 text-sm text-slate-400 hover:text-slate-600 underline">
                            Talvez depois
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
