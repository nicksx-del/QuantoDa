import React, { useState } from 'react';
import { X, Check, Lock, QrCode } from 'lucide-react';

interface PaywallModalProps {
  onClose: () => void;
  onPurchase: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onPurchase }) => {
  const [step, setStep] = useState<'offer' | 'payment'>('offer');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        {step === 'offer' ? (
          <div className="p-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Acabaram seus créditos</h2>
            <p className="text-slate-600 mb-6">
              Você usou sua análise gratuita. Para continuar descobrindo onde seu dinheiro está indo, adquira um pacote.
            </p>

            <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">
                Mais Popular
              </div>
              <h3 className="font-bold text-brand-900 text-lg">Pacote Econômico</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">R$ 19,90</span>
                <span className="text-slate-500 text-sm">/único</span>
              </div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-brand-900">
                  <Check size={16} className="text-brand-600" /> +3 Análises Completas
                </li>
                <li className="flex items-center gap-2 text-sm text-brand-900">
                  <Check size={16} className="text-brand-600" /> Recomendações de economia
                </li>
                <li className="flex items-center gap-2 text-sm text-brand-900">
                  <Check size={16} className="text-brand-600" /> Suporte prioritário
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setStep('payment')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg"
            >
              Comprar Agora (Pix)
            </button>

            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              Pagamento processado via <span className="font-bold text-slate-600">AbacatePay 🥑</span>
            </p>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Pagamento Pix</h3>
            <p className="text-sm text-slate-500 mb-6">Escaneie o código para liberar seus créditos instantaneamente.</p>
            
            <div className="bg-white border-2 border-brand-500 p-2 rounded-xl mb-6 shadow-sm">
               {/* Simulation of a QR Code */}
               <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <QrCode size={120} className="text-slate-800 opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <button 
                      onClick={onPurchase}
                      className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg"
                    >
                      Simular Pagamento
                    </button>
                  </div>
               </div>
            </div>

            <div className="w-full bg-slate-100 rounded p-3 text-xs text-slate-500 break-all font-mono">
              00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000
            </div>
            <p className="text-xs text-brand-600 mt-2 font-medium">Copia e Cola disponível</p>
            
            <button 
              onClick={() => setStep('offer')}
              className="mt-6 text-slate-400 text-sm hover:text-slate-600"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};