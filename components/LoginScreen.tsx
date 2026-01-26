import React from 'react';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface LoginProps {
    onLogin: () => void;
    onBack: () => void;
}

const cardVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 }
    }
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

const AnimatedInput = ({ label, type, id, value, onChange, placeholder, icon, isError }: any) => {
    const controls = useAnimation();

    React.useEffect(() => {
        if (isError) {
            controls.start({ x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } });
        }
    }, [isError, controls]);

    return (
        <motion.div variants={itemVariants}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <motion.div
                animate={controls}
                className="relative"
            >
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border ${isError ? 'border-red-400' : 'border-slate-200'} outline-none focus:ring-0 transition-all bg-white/50 pr-12`}
                />
                <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none border border-transparent"
                    initial={false}
                    whileFocus={{ borderColor: '#10b981', borderWidth: 1 }}
                    transition={{ duration: 0.2 }}
                />
                {icon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorShake, setErrorShake] = React.useState(false);

    // Password Validation Logic
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isPasswordStrong = hasMinLength && hasNumber && hasSpecialChar;

    const handleSubmit = async () => {
        if (!email || !password) {
            setErrorShake(true);
            setTimeout(() => setErrorShake(false), 500);
            return;
        }

        if (isSignUp && !isPasswordStrong) {
            setErrorShake(true);
            setTimeout(() => setErrorShake(false), 500);
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative">

            {/* Back Button */}
            <motion.button
                onClick={onBack}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute top-0 left-4 md:left-10 flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors z-20"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Voltar</span>
            </motion.button>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={isSignUp ? "signup" : "login"}
                    className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Decorative background blob */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob transition-all duration-700 ${isSignUp ? 'bg-purple-400' : 'bg-brand-400'}`}></div>
                    <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 transition-all duration-700 ${isSignUp ? 'bg-brand-400' : 'bg-purple-400'}`}></div>

                    <motion.div
                        className="relative z-10 flex flex-col items-center text-center"
                        variants={contentVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <div className="w-16 h-16 bg-gradient-to-tr from-brand-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3">
                                <span className="text-white font-bold text-2xl">Q?</span>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                {isSignUp ? "Crie sua conta" : "Bem-vindo de volta"}
                            </h2>
                            <p className="text-slate-500 mb-8">
                                {isSignUp ? "Comece a economizar hoje mesmo." : "Entre para acessar suas análises financeiras."}
                            </p>
                        </motion.div>

                        <div className="w-full space-y-4 mb-6 text-left">
                            <AnimatedInput
                                id="email"
                                label="E-mail"
                                type="email"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                isError={errorShake && !email}
                            />

                            <motion.div variants={itemVariants}>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                                <div className="relative">
                                    <AnimatedInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e: any) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        isError={errorShake && !password}
                                        icon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        }
                                    />
                                </div>

                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 space-y-2 overflow-hidden"
                                    >
                                        <p className="text-xs text-slate-500 font-medium mb-1">A senha deve conter:</p>
                                        <div className="flex flex-wrap gap-2">
                                            <ValidationBadge isValid={hasMinLength} text="8+ caracteres" />
                                            <ValidationBadge isValid={hasNumber} text="1 número" />
                                            <ValidationBadge isValid={hasSpecialChar} text="1 símbolo" />
                                        </div>
                                    </motion.div>
                                )}
                                {!isSignUp && (
                                    <div className="flex justify-end mt-1">
                                        <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Esqueceu a senha?</a>
                                    </div>
                                )}
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 ${isSignUp && !isPasswordStrong
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                    : 'bg-brand-600 text-white'
                                    }`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Loader2 size={24} />
                                    </motion.div>
                                ) : (
                                    isSignUp ? "Criar Conta" : "Entrar"
                                )}
                            </motion.button>
                        </div>

                        <motion.div variants={itemVariants} className="text-sm text-slate-600 mb-6">
                            {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setPassword('');
                                    setEmail('');
                                }}
                                className="font-semibold text-brand-600 hover:text-brand-700 underline decoration-brand-200 hover:decoration-brand-500 transition-all"
                            >
                                {isSignUp ? "Entrar agora" : "Crie agora"}
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative w-full mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/80 backdrop-blur-xl text-slate-500">Ou continue com</span>
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ backgroundColor: '#f8fafc' }}
                            className="group relative w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <motion.svg
                                className="w-6 h-6"
                                viewBox="0 0 48 48"
                                whileHover={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }}
                            >
                                <g>
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                </g>
                            </motion.svg>
                            <span className="group-hover:text-slate-900">Entrar com Google</span>
                        </motion.button>

                        <motion.div variants={itemVariants}>
                            <p className="mt-8 text-xs text-slate-400">
                                Ao continuar, você concorda com nossos <a href="#" className="underline hover:text-brand-600">Termos de Serviço</a> e <a href="#" className="underline hover:text-brand-600">Política de Privacidade</a>.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const ValidationBadge: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium transition-all duration-300 ${isValid
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
        {isValid ? (
            <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></motion.svg>
        ) : (
            <div className="w-3 h-3 rounded-full border-2 border-slate-300"></div>
        )}
        {text}
    </div>
);
