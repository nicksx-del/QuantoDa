import React from 'react';
import { Wallet, LogIn, LogOut, Coins } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  credits: number;
  onLogin: () => void;
  onLogout: () => void;
  onBuyCredits: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, credits, onLogin, onLogout, onBuyCredits }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-brand-500 text-white p-1.5 rounded-lg">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Quanto<span className="text-brand-600">Dá?</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div 
                className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={onBuyCredits}
              >
                <Coins size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-slate-700">{credits} crédito{credits !== 1 && 's'}</span>
                <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 rounded-sm ml-1">+</span>
              </div>
              
              <button 
                onClick={onLogout}
                className="text-slate-500 hover:text-slate-800 transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
            >
              <LogIn size={18} />
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};