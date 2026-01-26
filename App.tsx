import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Login } from './components/LoginScreen';
import { UploadZone } from './components/UploadZone';
import { Dashboard } from './components/Dashboard';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { PricingModal } from './components/PricingModal';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { analyzeFinancialStatement } from './services/geminiService';
import { AnalysisResult } from './types';
import { CommandMenu } from './components/CommandMenu';
import { useConsoleEasterEgg } from './hooks/useConsoleEasterEgg';
import { useAppSounds } from './hooks/useAppSounds';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  // State Management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useConsoleEasterEgg(); // Easter Egg
  const { playSuccess } = useAppSounds();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleLogin = () => {
    // Simulate Supabase Auth
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAnalysisResult(null);
    setError(null);
  };

  const handleFileUpload = async (file: File | null, mockText?: string) => {
    if (credits <= 0) {
      setShowPaywall(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      let textToAnalyze = mockText || "";

      // Simple text extraction for CSV/TXT (In a real app, PDF parsing would happen here or backend)
      if (file && !mockText) {
        if (file.type === "text/csv" || file.type === "text/plain") {
          textToAnalyze = await file.text();
        } else {
          // Fallback for demo if PDF is uploaded without backend:
          // We send a generic prompt to Gemini to simulate the experience or use a hardcoded sample if user chooses "Test"
          // For this demo, we assume the `mockText` is passed if 'Test Data' is clicked, 
          // or we extract text if it's a simple file.
          throw new Error("Para este demo, por favor use arquivos .csv, .txt ou o botão 'Testar com Dados Exemplo'. O processamento real de PDF requer backend.");
        }
      }

      const result = await analyzeFinancialStatement(textToAnalyze);

      playSuccess(); // Audio Feedback
      setAnalysisResult(result);
      setCredits(prev => prev - 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao analisar arquivo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBuyCredits = () => {
    // Simulate AbacatePay payment success
    setTimeout(() => {
      setCredits(prev => prev + 3);
      setShowPaywall(false);
    }, 1500);
  };

  // Render Logic
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-200 selection:text-brand-900">
      <Header
        isLoggedIn={isLoggedIn}
        credits={credits}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onBuyCredits={() => setShowPaywall(true)}
      />

      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            showLogin ? (
              <motion.div key="login" className="animate-slide-up" exit={{ opacity: 0, y: -20 }}>
                <Login
                  onLogin={handleLogin}
                  onBack={() => setShowLogin(false)}
                />
              </motion.div>
            ) : (
              <motion.div key="hero" exit={{ opacity: 0 }}>
                <Hero onLogin={() => setShowLogin(true)} />
              </motion.div>
            )
          ) : (
            <motion.div
              key="dashboard"
              layoutId="container-main"
              className="max-w-5xl mx-auto space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Context Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800">
                  {analysisResult ? "Seu Diagnóstico Financeiro" : "Nova Análise"}
                </h1>
                <p className="text-slate-600">
                  {analysisResult
                    ? "A IA identificou as seguintes assinaturas e gastos recorrentes."
                    : "Faça upload do seu extrato (CSV) ou fatura para identificar gastos invisíveis."}
                </p>
              </div>

              {/* Main Content Area */}
              {isAnalyzing ? (
                <DashboardSkeleton />
              ) : analysisResult ? (
                <div className="animate-scale-in">
                  <Dashboard
                    data={analysisResult}
                    onReset={() => setAnalysisResult(null)}
                  />
                </div>
              ) : (
                <motion.div
                  layoutId="upload-card"
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow duration-300"
                >
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-shake">
                      {error}
                    </div>
                  )}
                  <UploadZone onUpload={handleFileUpload} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Modals */}
      {showPaywall && (
        <PricingModal
          onClose={() => setShowPaywall(false)}
          onPurchase={handleBuyCredits}
        />
      )}

      <CommandMenu
        onUpload={() => {
          if (!isLoggedIn) setShowLogin(true);
          else setAnalysisResult(null); // Reset to upload screen
        }}
        onHome={() => {
          setIsLoggedIn(false);
          setShowLogin(false);
        }}
        onDashboard={() => {
          if (isLoggedIn) setAnalysisResult(null); // Just go to main dash view
          else setShowLogin(true);
        }}
      />
    </div>
  );
};

export default App;