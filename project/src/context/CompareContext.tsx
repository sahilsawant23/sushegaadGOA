import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CompareItem {
    id: string | number;
    name: string;
    image: string;
    category: 'tour' | 'destination' | 'hotel';
    price?: number;
    rating?: number;
    location?: string;
    duration?: string;
}

interface CompareContextType {
    items: CompareItem[];
    addToCompare: (item: CompareItem) => void;
    removeFromCompare: (id: string | number) => void;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CompareItem[]>(() => {
        const saved = localStorage.getItem('compareItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('compareItems', JSON.stringify(items));
    }, [items]);

    const addToCompare = (item: CompareItem) => {
        if (items.some((i) => i.id === item.id)) {
            toast.error('Item already added to compare!');
            return;
        }
        if (items.length >= 3) {
            toast.error('You can only compare up to 3 items.');
            return;
        }
        setItems((prev) => [...prev, item]);
        toast.success('Added to comparison tray!');
    };

    const removeFromCompare = (id: string | number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const clearCompare = () => {
        setItems([]);
    };

    return (
        <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};
