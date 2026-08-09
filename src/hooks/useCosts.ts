'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CostEntry, BudgetCategory, Vendor } from '@/types';

export function useCosts(projectId: string) {
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const [costsRes, catsRes, vendorsRes] = await Promise.all([
        fetch(`/api/costs?projectId=${projectId}`, { signal: controller.signal }),
        fetch(`/api/categories?projectId=${projectId}`, { signal: controller.signal }),
        fetch('/api/vendors', { signal: controller.signal }),
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
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
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
    // Optimistic: prepend to local state
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
    // Optimistic: remove from UI immediately
    setCosts((prev) => prev.filter((c) => c.id !== id));
    const res = await fetch(`/api/costs/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      await fetchData();
      throw new Error('Failed to delete cost entry');
    }
  };

  return { costs, categories, vendors, loading, error, fetchData, createCost, updateCost, deleteCost };
}
