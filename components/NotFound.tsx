import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Shadow, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Ghost = () => {
    const headRef = useRef<THREE.Group>(null);
    const eyesRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!headRef.current || !eyesRef.current) return;

        // Mouse tracking
        const { x, y } = state.mouse;

        // Rotate entire ghost slightly towards mouse (body language)
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, x * 0.5, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -y * 0.2, 0.1);

        // Eyes track more intensely
        eyesRef.current.rotation.y = THREE.MathUtils.lerp(eyesRef.current.rotation.y, x * 1, 0.2);
        eyesRef.current.rotation.x = THREE.MathUtils.lerp(eyesRef.current.rotation.x, -y * 1, 0.2);
    });

    return (
        <group ref={headRef}>
            <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={1}
                floatingRange={[-0.2, 0.2]}
            >
                {/* Body/Head */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <MeshDistortMaterial
                        color="#ffffff"
                        roughness={0.2}
                        metalness={0.1}
                        distort={0.4} // Wobbly ghost effect
                        speed={2}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Eyes Group */}
                <group ref={eyesRef} position={[0, 0.2, 1.2]} >
                    {/* Eye Left */}
                    <mesh position={[-0.4, 0, 0]}>
                        <sphereGeometry args={[0.25, 32, 32]} />
                        <meshStandardMaterial color="#1f2937" roughness={0.2} />
                    </mesh>
                    {/* Eye Right */}
                    <mesh position={[0.4, 0, 0]}>
                        <sphereGeometry args={[0.25, 32, 32]} />
                        <meshStandardMaterial color="#1f2937" roughness={0.2} />
                    </mesh>
                </group>

                {/* Glow */}
                <pointLight position={[0, 0, 0]} intensity={2} color="#10b981" distance={5} />
            </Float>

            {/* Shadow */}
            <Shadow position={[0, -2.5, 0]} scale={3} opacity={0.3} color="black" />
        </group>
    );
};

interface NotFoundProps {
    onBack: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBack }) => {
    return (
        <div className="relative w-full h-screen bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <Ghost />
                    <Environment preset="night" />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="relative z-10 text-center space-y-8 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-[120px] font-black text-white leading-none tracking-tighter opacity-10">
                        404
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-[-40px]">
                        Boo! Sumiu.
                    </h2>
                    <p className="text-slate-400 mt-4 text-lg max-w-md mx-auto">
                        A página que você procura evaporou ou nunca existiu. Cuidado com os fantasmas financeiros.
                    </p>
                </motion.div>

                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto group px-8 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-full font-bold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para a realidade
                </motion.button>
            </div>
        </div>
    );
};
