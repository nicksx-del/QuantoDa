import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sphere, Box, Torus, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

const FloatingSatellite = ({ geometry, position, color, speed = 1, delay = 0 }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Independent rotation
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.015;

            // Floating effect (Sine wave on Y axis)
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + delay) * 0.2;
        }
    });

    const Material = (
        <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
        />
    );

    return (
        <mesh ref={meshRef} position={position}>
            {geometry === 'box' && <boxGeometry args={[0.6, 0.6, 0.6]} />}
            {geometry === 'torus' && <torusGeometry args={[0.4, 0.15, 16, 32]} />}
            {geometry === 'icosahedron' && <icosahedronGeometry args={[0.5, 0]} />}
            {geometry === 'sphere' && <sphereGeometry args={[0.4, 32, 32]} />}
            {Material}
        </mesh>
    );
};

const SceneContent = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Global slow rotation
            groupRef.current.rotation.y += 0.003;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central Core: Emerald Frosted Glass */}
            <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
                <meshPhysicalMaterial
                    color="#10B981"         // Brand Green
                    roughness={0.2}         // Slightly frosted
                    transmission={0.6}      // Glass-like transparency
                    thickness={1.5}         // Refraction thickness
                    clearcoat={1}           // Shiny top layer
                    clearcoatRoughness={0.1}
                    emissive="#064e3b"      // Deep green glow from inside
                    emissiveIntensity={0.2}
                />
            </Sphere>

            {/* Orbiting Satellites */}
            <FloatingSatellite
                geometry="box"
                position={[2.5, 1, 0]}
                color="#EF4444" // Red (Netflix-ish)
                speed={1.5}
                delay={0}
            />
            <FloatingSatellite
                geometry="torus"
                position={[-2, -1.2, 1.5]}
                color="#3B82F6" // Blue (Prime/Spotify-ish)
                speed={1.2}
                delay={2}
            />
            <FloatingSatellite
                geometry="icosahedron"
                position={[0, 2, -2]}
                color="#F59E0B" // Yellow/Gold
                speed={1}
                delay={4}
            />
            <FloatingSatellite
                geometry="sphere"
                position={[-2.8, 0.5, -1]}
                color="#8B5CF6" // Purple (Twitch/Game-ish)
                speed={1.8}
                delay={1}
            />
            <FloatingSatellite
                geometry="box"
                position={[1.5, -2, 2]}
                color="#EC4899" // Pink
                speed={1.3}
                delay={3}
            />
        </group>
    );
};



export const Hero3DScene: React.FC = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="w-full h-[300px] absolute top-0 left-0 -z-10 bg-gradient-to-br from-white to-brand-50 flex items-center justify-center opacity-40">
                {/* Fallback Static Visual */}
                <div className="w-40 h-40 bg-brand-100/50 rounded-full blur-3xl animate-pulse"></div>
            </div>
        )
    }

    return (
        <div className="w-full h-[500px] md:h-[600px] absolute top-0 left-0 -z-10 md:z-0 md:relative md:w-1/2">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]} // Handle high-DPI screens
            >
                {/* Quality Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1}
                    color="#ffffff"
                    castShadow
                />

                {/* Realistic Reflections */}
                <Environment preset="city" />

                <SceneContent />
            </Canvas>
        </div>
    );
};
