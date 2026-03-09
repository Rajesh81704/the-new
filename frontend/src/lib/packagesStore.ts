// Shared reactive store for payment packages
// Used by SuperAdminBilling and SuperAdminCompanies

export interface PaymentPackage {
    id: string;
    name: string;
    description: string;
    billingCycle: "monthly" | "quarterly" | "biannual" | "yearly";
    amount: number;
    active: boolean;
    createdAt: string;
}

export const BILLING_CYCLE_LABELS: Record<PaymentPackage["billingCycle"], string> = {
    monthly: "Monthly",
    quarterly: "Every 3 Months",
    biannual: "Every 6 Months",
    yearly: "Yearly",
};

// Simple module-level reactive store with subscriber pattern
let _packages: PaymentPackage[] = [
    {
        id: "1",
        name: "Starter Shield",
        description: "Basic access for small teams",
        billingCycle: "monthly",
        amount: 4999,
        active: true,
        createdAt: "Jan 2026",
    },
    {
        id: "2",
        name: "Brahmastra",
        description: "Full-power quarterly plan for growing networks",
        billingCycle: "quarterly",
        amount: 24999,
        active: true,
        createdAt: "Feb 2026",
    },
    {
        id: "3",
        name: "Enterprise Titan",
        description: "Annual enterprise plan with all modules",
        billingCycle: "yearly",
        amount: 79999,
        active: true,
        createdAt: "Mar 2026",
    },
];

type Listener = () => void;
const _listeners: Listener[] = [];

export const packagesStore = {
    getAll: () => _packages,
    getActive: () => _packages.filter((p) => p.active),
    subscribe: (fn: Listener) => {
        _listeners.push(fn);
        return () => {
            const i = _listeners.indexOf(fn);
            if (i > -1) _listeners.splice(i, 1);
        };
    },
    add: (pkg: Omit<PaymentPackage, "id" | "createdAt">) => {
        const newPkg: PaymentPackage = {
            ...pkg,
            id: Date.now().toString(),
            createdAt: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        };
        _packages = [..._packages, newPkg];
        _listeners.forEach((fn) => fn());
        return newPkg;
    },
    update: (id: string, updates: Partial<PaymentPackage>) => {
        _packages = _packages.map((p) => (p.id === id ? { ...p, ...updates } : p));
        _listeners.forEach((fn) => fn());
    },
    remove: (id: string) => {
        _packages = _packages.filter((p) => p.id !== id);
        _listeners.forEach((fn) => fn());
    },
};

// React hook for consuming the store
import { useState, useEffect } from "react";
export function usePackages() {
    const [packages, setPackages] = useState<PaymentPackage[]>(packagesStore.getAll());
    useEffect(() => {
        return packagesStore.subscribe(() => setPackages([...packagesStore.getAll()]));
    }, []);
    return packages;
}
