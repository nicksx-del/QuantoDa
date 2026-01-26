import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File | null, mockText?: string) => void;
}

// Sample data to simulate a bank statement for the demo
const MOCK_STATEMENT_DATA = `
DATA,DESCRIÇÃO,VALOR
2024-05-01,NETFLIX.COM, -55.90
2024-05-02,UBER DO BRASIL, -24.90
2024-05-03,SPOTIFY STUDENT, -11.90
2024-05-05,AMAZON PRIME, -19.90
2024-05-10,SMART FIT ACADEMIA, -129.90
2024-05-12,IFOOOD BR, -89.00
2024-05-15,ADOBE CREATIVE CLOUD, -224.00
2024-05-20,APPLE SERVICES, -14.90
2024-05-22,CHATGPT SUBSCRIPTION, -100.00
2024-05-25,PADARIA DO ZÉ, -12.50
2024-05-28,POSTO IPIRANGA, -150.00
`;

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleUseSample = () => {
    // Bypass file upload and send mock string
    onUpload(null, MOCK_STATEMENT_DATA);
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200 ${
          dragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50"
        } ${selectedFile ? "bg-emerald-50 border-emerald-400" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".csv,.txt,.pdf"
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="text-center animate-fade-in">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 mx-auto" />
            <p className="text-lg font-semibold text-slate-800">{selectedFile.name}</p>
            <p className="text-sm text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            <button 
              onClick={() => setSelectedFile(null)}
              className="mt-4 text-sm text-red-500 hover:text-red-700 underline"
            >
              Remover arquivo
            </button>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud className={`w-16 h-16 mb-4 mx-auto ${dragActive ? "text-brand-500" : "text-slate-400"}`} />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Arraste e solte seu extrato
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Suporta CSV ou PDF (Fatura do cartão ou extrato bancário)
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Selecionar Arquivo
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button 
          onClick={handleUseSample}
          className="text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1.5 underline underline-offset-2"
        >
          <FileText size={16} />
          Testar com dados de exemplo (Demo)
        </button>

        <button 
          onClick={handleSubmit}
          disabled={!selectedFile}
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
            selectedFile 
              ? "bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5 shadow-brand-500/30" 
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          Iniciar Análise IA
        </button>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Dica de Privacidade:</p>
          <p>Para este demo, recomendamos o uso do botão <strong>"Testar com dados de exemplo"</strong>. Se fizer upload, seus dados são processados apenas na memória do navegador e enviados à IA para categorização.</p>
        </div>
      </div>
    </div>
  );
};