import React, { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

interface DataItem {
    name: string;
    value: number;
    color: string;
}

interface FinancialDonut3DProps {
    data: DataItem[];
    onHover?: (category: string | null) => void;
}

const ArcSegment = ({
    startAngle,
    endAngle,
    color,
    innerRadius,
    outerRadius,
    height,
    isHovered,
    onPointerOver,
    onPointerOut
}: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
        shape.absarc(0, 0, innerRadius, endAngle, startAngle, true); // Create hole

        return new THREE.ExtrudeGeometry(shape, {
            depth: height,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelSegments: 4,
            curveSegments: 32 // Smooth curves
        });
    }, [startAngle, endAngle, innerRadius, outerRadius, height]);

    // Calculate center direction for "explode" effect
    const midAngle = (startAngle + endAngle) / 2;
    const explodeDistance = 0.5;
    const x = Math.cos(midAngle) * explodeDistance;
    const y = Math.sin(midAngle) * explodeDistance;

    // Animate position using Framer Motion 3D logic manually or cleanly via useFrame for simpler interp
    useFrame((state) => {
        if (meshRef.current) {
            const targetPos = isHovered ? new THREE.Vector3(x, y, 0) : new THREE.Vector3(0, 0, 0);
            meshRef.current.position.lerp(targetPos, 0.1);

            // Emissive pulse when hovered
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            if (material) {
                const targetEmissive = isHovered ? new THREE.Color(color).multiplyScalar(0.5) : new THREE.Color(0, 0, 0);
                material.emissive.lerp(targetEmissive, 0.1);
            }
        }
    });

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            rotation={[0, 0, 0]}
        >
            <meshPhysicalMaterial
                color={color}
                metalness={0.1}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
            />
        </mesh>
    );
};

const DonutChartGroup = ({ data, onHoverItem }: { data: DataItem[], onHoverItem: (name: string | null) => void }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Calculate angles
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let currentAngle = 0;

    const segments = data.map((item, index) => {
        const angle = (item.value / total) * Math.PI * 2;
        const start = currentAngle;
        const end = currentAngle + angle;
        currentAngle += angle;

        return { ...item, startAngle: start, endAngle: end, index };
    });

    useFrame((state) => {
        if (!groupRef.current) return;

        // Auto-rotate if not hovering
        if (hoveredIndex === null) {
            groupRef.current.rotation.y += 0.002;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1; // Gentle sway
        } else {
            // Slow down rotation to a stop smoothly? Or just lerp to a specific angle?
            // Let's just stop smoothly
            // groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, groupRef.current.rotation.y, 0.1);
        }
    });

    return (
        <group ref={groupRef} rotation={[0.5, 0, 0]}> {/* Tilted slightly */}
            {segments.map((segment) => (
                <ArcSegment
                    key={segment.name}
                    innerRadius={1.5}
                    outerRadius={2.5}
                    height={0.5}
                    startAngle={segment.startAngle}
                    endAngle={segment.endAngle}
                    color={segment.color}
                    isHovered={hoveredIndex === segment.index}
                    onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                        e.stopPropagation();
                        setHoveredIndex(segment.index);
                        onHoverItem(segment.name);
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={(e: ThreeEvent<PointerEvent>) => {
                        setHoveredIndex(null);
                        onHoverItem(null);
                        document.body.style.cursor = 'auto';
                    }}
                />
            ))}

            {/* Center Text */}
            <Html position={[0, 0, 1]} center pointerEvents="none">
                <div className={`transition-opacity duration-300 ${hoveredIndex !== null ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                    <div className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-lg shadow-xl text-center min-w-[120px]">
                        {hoveredIndex !== null && (
                            <>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">{data[hoveredIndex].name}</div>
                                <div className="text-lg font-bold text-brand-400">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data[hoveredIndex].value)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Html>
        </group>
    )
}



export const FinancialDonut3D: React.FC<FinancialDonut3DProps> = ({ data, onHover }) => {
    const isMobile = useIsMobile();

    return (
        <div className="w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={isMobile ? 1 : [1, 2]}> {/* Lower quality on mobile */}
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Environment preset="city" />

                <DonutChartGroup data={data} onHoverItem={(name) => onHover && onHover(name)} />
            </Canvas>
        </div>
    );
};
