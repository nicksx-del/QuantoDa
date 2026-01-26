import { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';

const STORAGE_KEY = 'quantoda_history';

// Mock Data for "Senior" Demo
const MOCK_HISTORY: AnalysisResult[] = [
    {
        id: 'mock-1',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(), // 5 months ago
        totalMonthly: 450.00,
        totalYearly: 5400.00,
        subscriptionCount: 8,
        items: [],
        insights: []
    },
    {
        id: 'mock-2',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // 4 months ago
        totalMonthly: 420.00,
        totalYearly: 5040.00,
        subscriptionCount: 7,
        items: [],
        insights: []
    },
    {
        id: 'mock-3',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 3 months ago
        totalMonthly: 380.00, // Dropping
        totalYearly: 4560.00,
        subscriptionCount: 6,
        items: [],
        insights: []
    },
    {
        id: 'mock-4',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 2 months ago
        totalMonthly: 410.00, // Spike (maybe new sub?)
        totalYearly: 4920.00,
        subscriptionCount: 7,
        items: [],
        insights: []
    },
    {
        id: 'mock-5',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month ago
        totalMonthly: 300.00, // Big drop!
        totalYearly: 3600.00,
        subscriptionCount: 5,
        items: [],
        insights: []
    }
];

export const useHistory = () => {
    const [history, setHistory] = useState<AnalysisResult[]>([]);

    // Load on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setHistory(JSON.parse(stored));
        } else {
            // Seed mock data if empty for the demo
            setHistory(MOCK_HISTORY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_HISTORY));
        }
    }, []);

    const saveAnalysis = (result: AnalysisResult) => {
        const newRecord = {
            ...result,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };

        const updated = [newRecord, ...history];
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    }

    return { history, saveAnalysis, clearHistory };
};
