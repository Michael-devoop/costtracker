'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CostItemWithTotal } from '@/types';

export function useCostItems(projectId: string) {
  const [items, setItems] = useState<CostItemWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchItems = useCallback(async () => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cost-items?projectId=${projectId}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error('Failed to fetch cost items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchItems();
    return () => abortRef.current?.abort();
  }, [fetchItems]);

  const createItem = async (data: { name: string; nameAm?: string; categoryId: string; icon?: string; unit?: string }) => {
    const res = await fetch('/api/cost-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, projectId }),
    });
    if (!res.ok) throw new Error('Failed to create cost item');
    const created = await res.json();
    // Optimistic: append to local state instead of full re-fetch
    setItems((prev) => [...prev, { ...created, totalSpent: 0, entryCount: 0 }]);
    return created;
  };

  const updateItem = async (id: string, data: Partial<{ name: string; nameAm?: string; categoryId: string; icon?: string; unit?: string }>) => {
    const res = await fetch(`/api/cost-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update cost item');
    const updated = await res.json();
    // Optimistic: patch local state
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      )
    );
    return updated;
  };

  const deleteItem = async (id: string) => {
    // Optimistic: remove from UI immediately
    setItems((prev) => prev.filter((item) => item.id !== id));
    const res = await fetch(`/api/cost-items/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      // Rollback on failure
      await fetchItems();
      throw new Error('Failed to delete cost item');
    }
  };

  return { items, loading, error, fetchItems, createItem, updateItem, deleteItem };
}
