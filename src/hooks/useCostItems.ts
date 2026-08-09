'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CostItemWithTotal } from '@/types';

export function useCostItems(projectId: string) {
  const [items, setItems] = useState<CostItemWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cost-items?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch cost items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (data: { name: string; nameAm?: string; categoryId: string; icon?: string; unit?: string }) => {
    const res = await fetch('/api/cost-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, projectId }),
    });
    if (!res.ok) throw new Error('Failed to create cost item');
    const created = await res.json();
    await fetchItems();
    return created;
  };

  return { items, loading, error, fetchItems, createItem };
}
