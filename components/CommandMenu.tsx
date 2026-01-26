import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, LayoutDashboard, Settings, FileUp, Moon, HelpCircle, MessageCircle, Clock } from 'lucide-react';
import { useAppSounds } from '../hooks/useAppSounds';

interface CommandMenuProps {
    onUpload: () => void;
    onHome: () => void;
    onDashboard: () => void; // If accessed via state
    onHistory: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ onUpload, onHome, onDashboard, onHistory }) => {
    const [open, setOpen] = useState(false);
    const { playSwitch } = useAppSounds();

    // Toggle with Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();

                // Only open, don't close on K? Or toggle? Standard is toggle.
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
                    >
                        <Command className="w-full">
                            <div className="flex items-center border-b border-slate-100 px-3" cmdk-input-wrapper="">
                                <Search className="w-5 h-5 text-slate-400 mr-2" />
                                <Command.Input
                                    placeholder="O que você precisa?"
                                    className="w-full py-4 text-base outline-none text-slate-700 placeholder:text-slate-400"
                                />
                            </div>

                            <Command.List className="max-h-[300px] overflow-y-auto p-2">
                                <Command.Empty className="py-6 text-center text-slate-500 text-sm">
                                    👻 Nenhum fantasma encontrado...
                                </Command.Empty>

                                <Command.Group heading="Navegação" className="text-xs font-medium text-slate-400 mb-2 px-2 mt-2">
                                    <CommandItem icon={<Home size={18} />} onSelect={() => { onHome(); setOpen(false); }}>
                                        Ir para Home
                                    </CommandItem>
                                    <CommandItem icon={<LayoutDashboard size={18} />} onSelect={() => { onDashboard(); setOpen(false); }}>
                                        Ir para Dashboard
                                    </CommandItem>
                                    <CommandItem icon={<Clock size={18} />} onSelect={() => { onHistory(); setOpen(false); }}>
                                        Ver Linha do Tempo
                                    </CommandItem>
                                    <CommandItem icon={<Settings size={18} />} onSelect={() => setOpen(false)}>
                                        Ir para Configurações
                                    </CommandItem>
                                </Command.Group>

                                <Command.Separator className="h-px bg-slate-100 my-2" />

                                <Command.Group heading="Ações Rápidas" className="text-xs font-medium text-slate-400 mb-2 px-2">
                                    <CommandItem icon={<FileUp size={18} />} onSelect={() => { onUpload(); setOpen(false); }}>
                                        Novo Upload
                                    </CommandItem>
                                    <CommandItem icon={<Moon size={18} />} onSelect={() => {
                                        playSwitch();
                                        alert('Modo escuro em breve!');
                                        setOpen(false);
                                    }}>
                                        Trocar Tema
                                    </CommandItem>
                                </Command.Group>

                                <Command.Separator className="h-px bg-slate-100 my-2" />

                                <Command.Group heading="Ajuda" className="text-xs font-medium text-slate-400 mb-2 px-2">
                                    <CommandItem icon={<HelpCircle size={18} />} onSelect={() => setOpen(false)}>
                                        Ver Atalhos
                                    </CommandItem>
                                    <CommandItem icon={<MessageCircle size={18} />} onSelect={() => { window.open('mailto:contato@quantoda.com'); setOpen(false); }}>
                                        Entrar em contato
                                    </CommandItem>
                                </Command.Group>

                            </Command.List>
                        </Command>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CommandItem = ({ children, icon, onSelect }: { children: React.ReactNode, icon: React.ReactNode, onSelect: () => void }) => {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center px-4 py-3 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors aria-selected:bg-brand-50 aria-selected:text-brand-700 group my-1"
        >
            <span className="mr-3 text-slate-400 group-aria-selected:text-brand-500 transition-colors">
                {icon}
            </span>
            {children}
        </Command.Item>
    );
}
