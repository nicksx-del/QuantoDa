import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { UploadZone } from './components/UploadZone';
import { Dashboard } from './components/Dashboard';
import { PaywallModal } from './components/PaywallModal';
import { Header } from './components/Header';
import { analyzeFinancialStatement } from './services/geminiService';
import { AnalysisResult } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // State Management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleLogin = () => {
    // Simulate Supabase Auth
    setIsLoggedIn(true);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        credits={credits} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        onBuyCredits={() => setShowPaywall(true)}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <Hero onLogin={handleLogin} />
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
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
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">A IA está lendo seu extrato...</h3>
                <p className="text-slate-500 mt-2">Identificando padrões de consumo e assinaturas.</p>
              </div>
            ) : analysisResult ? (
              <div className="animate-fade-in">
                <Dashboard 
                  data={analysisResult} 
                  onReset={() => setAnalysisResult(null)} 
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                <UploadZone onUpload={handleFileUpload} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>© 2024 QuantoDá? - Economia inteligente com IA.</p>
      </footer>

      {/* Modals */}
      {showPaywall && (
        <PaywallModal 
          onClose={() => setShowPaywall(false)} 
          onPurchase={handleBuyCredits} 
        />
      )}
    </div>
  );
};

export default App;