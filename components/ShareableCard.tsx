import React from 'react';

// Satori supports a subset of CSS, mostly Flexbox.
// We must use inline styles or a compatible object structure.
// This component is NOT rendered in the DOM, but passed to satori.

interface ShareableCardProps {
    data: {
        totalMonthly: number;
        totalYearly: number;
        subscriptionCount: number;
        topExpenses: { name: string; value: number }[];
    };
    date: string;
}

export const ShareableCard = ({ data, date }: ShareableCardProps) => {
    const isApproved = data.totalMonthly < 1000; // Arbitrary logic for "Approved" state for savings
    // If high spending, maybe "ALERTA"

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent', // Container background
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '400px',
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '0px', // Receipt look
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontFamily: 'Roboto Mono, monospace',
                    position: 'relative',
                    borderTop: '8px solid #10b981', // Brand border
                    backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', // Subtle pattern
                    backgroundSize: '20px 20px'
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>QUANTO DÁ?</div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Diagnóstico Financeiro</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{date}</div>
                </div>

                <div style={{ width: '100%', height: '1px', borderBottom: '2px dashed #e5e7eb', marginBottom: '20px' }}></div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Top Gastos Recorrentes</div>
                    {data.topExpenses.slice(0, 5).map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#374151', textTransform: 'uppercase' }}>{item.name}</span>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ width: '100%', height: '1px', borderBottom: '2px dashed #e5e7eb', marginBottom: '20px' }}></div>

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>Assinaturas</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{data.subscriptionCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>TOTAL MENSAL</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalMonthly)}
                        </span>
                    </div>
                </div>

                {/* Stamp */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '20px',
                        border: `4px solid ${isApproved ? '#22c55e' : '#ef4444'}`,
                        padding: '10px 20px',
                        borderRadius: '8px',
                        color: isApproved ? '#22c55e' : '#ef4444',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        textTransform: 'uppercase',
                        opacity: 0.8,
                        transform: 'rotate(-15deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isApproved ? 'APROVADO' : 'ALERTA'}
                </div>

                {/* Footer Barcode Simulation */}
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
                    <div style={{ height: '30px', width: '2px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '4px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '1px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '3px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '2px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '5px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '2px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '1px', backgroundColor: '#000', margin: '0 2px' }}></div>
                    <div style={{ height: '30px', width: '3px', backgroundColor: '#000', margin: '0 2px' }}></div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#9ca3af', marginTop: '5px' }}>
                    quantoda.com.br
                </div>

            </div>
        </div>
    );
};
