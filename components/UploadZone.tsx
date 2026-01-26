import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, FileSpreadsheet, ScanLine } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onUpload: (file: File | null, mockText?: string) => void;
}

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const controls = useAnimation();
  const buttonShakeControls = useAnimation();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      controls.start({
        scale: [1.02, 0.98, 1],
        transition: { duration: 0.3 }
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    } else {
      buttonShakeControls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  const handleUseSample = () => {
    onUpload(null, MOCK_STATEMENT_DATA);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <motion.div
          {...getRootProps()}
          animate={controls}
          whileHover={{ scale: selectedFile ? 1 : 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors duration-300 ${isDragActive
            ? "border-brand-500 bg-brand-50/50"
            : selectedFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-300 bg-slate-50 hover:bg-slate-100/50"
            }`}
        >
          <input {...getInputProps()} />

          {!isDragActive && !selectedFile && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300" style={{ strokeWidth: 2, fill: 'none' }}>
              <motion.rect
                width="100%"
                height="100%"
                rx="16"
                initial={{ strokeDasharray: "10 10", strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -20 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </svg>
          )}


          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center relative"
              >
                <div className="relative mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent w-full h-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    style={{ maskImage: 'linear-gradient(black, black)' }}
                  />
                </div>

                <p className="text-lg font-semibold text-slate-800">{selectedFile.name}</p>
                <p className="text-sm text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium hover:underline"
                >
                  Trocar arquivo
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={isDragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <UploadCloud className={`w-16 h-16 mb-4 mx-auto ${isDragActive ? "text-brand-500" : "text-slate-400"}`} />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  {isDragActive ? "Pode soltar!" : "Arraste e solte seu extrato"}
                </h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Suporta CSV ou PDF (Fatura do cartão ou extrato bancário)
                </p>
                <span className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 font-medium group-hover:bg-slate-50 transition-colors">
                  Selecionar Arquivo
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleUseSample}
          className="text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1.5 underline underline-offset-2 transition-colors"
        >
          <FileText size={16} />
          Testar com dados de exemplo (Demo)
        </button>

        <motion.button
          onClick={handleSubmit}
          animate={buttonShakeControls}
          layout
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${selectedFile
            ? "bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5 shadow-brand-500/30"
            : "bg-slate-300 cursor-not-allowed"
            }`}
        >
          {selectedFile && <ScanLine size={18} className="animate-pulse" />}
          Iniciar Análise IA
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100"
      >
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Dica de Privacidade:</p>
          <p>Para este demo, recomendamos o uso do botão <strong>"Testar com dados de exemplo"</strong>. Se fizer upload, seus dados são processados apenas na memória do navegador e enviados à IA para categorização.</p>
        </div>
      </motion.div>
    </div>
  );
};