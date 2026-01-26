import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogIn, LogOut, Coins, Menu, X } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  credits: number;
  onLogin: () => void;
  onLogout: () => void;
  onBuyCredits: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, credits, onLogin, onLogout, onBuyCredits }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        {isLoggedIn ? (
          <motion.div
            layoutId="logo-main"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.location.reload()}
          >
            <div className="bg-brand-500 text-white p-2 rounded-xl shadow-brand group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Wallet size={24} className="stroke-[2.5px]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-brand-600 transition-colors">
              Quanto<span className="text-brand-600">Dá?</span>
            </span>
          </motion.div>
        ) : (
          <div className="w-10 h-10"></div> /* Spacer if logo hidden */
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={onBuyCredits}
                className="group flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full hover:border-brand-200 hover:bg-brand-50/50 transition-all duration-300"
              >
                <div className="bg-amber-100 p-1 rounded-full group-hover:scale-110 transition-transform">
                  <Coins size={16} className="text-amber-600" />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Créditos</span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-brand-700">{credits} disponíveis</span>
                </div>
                <div className="ml-1 w-6 h-6 flex items-center justify-center bg-brand-500 text-white rounded-full text-xs font-bold shadow-sm group-hover:bg-brand-600">
                  +
                </div>
              </button>

              <div className="h-8 w-px bg-slate-200 mx-2" />

              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium text-sm transition-colors py-2 px-3 rounded-lg hover:bg-red-50"
                title="Sair"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn size={18} />
              Entrar
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-4 animate-slide-down">
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <div
                  onClick={() => { onBuyCredits(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 active:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Coins size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Seu Saldo</p>
                      <p className="text-xs text-slate-500">{credits} créditos</p>
                    </div>
                  </div>
                  <span className="text-brand-600 text-sm font-bold">Comprar +</span>
                </div>

                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium border border-transparent hover:border-red-100"
                >
                  <LogOut size={20} />
                  Sair da conta
                </button>
              </>
            ) : (
              <button
                onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-xl font-medium active:bg-brand-700"
              >
                <LogIn size={20} />
                Acessar Conta
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};