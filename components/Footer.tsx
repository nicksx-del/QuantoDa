import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} QuantoDá? Todos os direitos reservados.
                </p>

                <a
                    href="https://github.com/nicksx-del/QuantoDa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
                    title="Ver código no GitHub"
                >
                    <Github size={20} />
                </a>
            </div>
        </footer>
    );
};
