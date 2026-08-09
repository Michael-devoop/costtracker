'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CostEntry, BudgetCategory, Vendor } from '@/types';

export function useCosts(projectId: string) {
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [costsRes, catsRes, vendorsRes] = await Promise.all([
        fetch(`/api/costs?projectId=${projectId}`),
        fetch(`/api/categories?projectId=${projectId}`),
        fetch('/api/vendors'),
      ]);

      if (!costsRes.ok || !catsRes.ok || !vendorsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [costsData, catsData, vendorsData] = await Promise.all([
        costsRes.json(),
        catsRes.json(),
        vendorsRes.json(),
      ]);

      setCosts(costsData);
      setCategories(catsData);
      setVendors(vendorsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createCost = async (data: Record<string, unknown>) => {
    const res = await fetch('/api/costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, projectId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.message || 'Failed to create cost entry');
    }
    const created = await res.json();
    setCosts((prev) => [created, ...prev]);
    return created;
  };

  const updateCost = async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/costs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update cost entry');
    const updated = await res.json();
    setCosts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCost = async (id: string) => {
    const res = await fetch(`/api/costs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete cost entry');
    setCosts((prev) => prev.filter((c) => c.id !== id));
  };

  return { costs, categories, vendors, loading, error, fetchData, createCost, updateCost, deleteCost };
}
