import { createClient } from '@/lib/supabase/server';
import type { Project, BudgetCategory, CostEntry, Vendor, ChangeOrder, Notification, CostItem, CostItemWithTotal, ProjectSummary, CategorySummary } from '@/types';

// ─── Helper: snake_case → camelCase row mapper ────────────────
function toProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    clientName: row.client_name as string,
    address: row.address as string,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    status: row.status as Project['status'],
    totalBudget: Number(row.total_budget),
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function toCategory(row: Record<string, unknown>): BudgetCategory {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    code: row.code as string,
    budgetedAmount: Number(row.budgeted_amount),
    parentCategoryId: row.parent_category_id as string | undefined,
    createdAt: row.created_at as string,
  };
}

function toCostEntry(row: Record<string, unknown>): CostEntry {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    categoryId: row.category_id as string,
    vendorId: row.vendor_id as string | undefined,
    description: row.description as string,
    amount: Number(row.amount),
    entryDate: row.entry_date as string,
    paymentStatus: row.payment_status as CostEntry['paymentStatus'],
    entryType: row.entry_type as CostEntry['entryType'],
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function toVendor(row: Record<string, unknown>): Vendor {
  return {
    id: row.id as string,
    name: row.name as string,
    contactName: row.contact_name as string,
    phone: row.phone as string,
    email: row.email as string | undefined,
    trade: row.trade as string,
    createdAt: row.created_at as string,
  };
}

function toChangeOrder(row: Record<string, unknown>): ChangeOrder {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    description: row.description as string,
    amount: Number(row.amount),
    status: row.status as ChangeOrder['status'],
    requestedDate: row.requested_date as string,
    approvedDate: row.approved_date as string | undefined,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  };
}

function toCostItem(row: Record<string, unknown>): CostItem {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    nameAm: row.name_am as string | undefined,
    categoryId: row.category_id as string,
    vendorId: row.vendor_id as string | undefined,
    icon: row.icon as string,
    unit: row.unit as string | undefined,
    usageCount: Number(row.usage_count),
    createdAt: row.created_at as string,
  };
}

function toNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    projectId: row.project_id as string | undefined,
    message: row.message as string,
    isRead: row.is_read as boolean,
    type: row.type as Notification['type'],
    createdAt: row.created_at as string,
  };
}

// ─── Projects ─────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toProject);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  return toProject(data);
}

export async function createProject(project: Project): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').insert({
    id: project.id,
    name: project.name,
    client_name: project.clientName,
    address: project.address,
    start_date: project.startDate,
    end_date: project.endDate,
    status: project.status,
    total_budget: project.totalBudget,
    created_by: project.createdBy,
  }).select().single();
  if (error) throw error;
  return toProject(data);
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const supabase = await createClient();
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.clientName !== undefined) mapped.client_name = updates.clientName;
  if (updates.address !== undefined) mapped.address = updates.address;
  if (updates.startDate !== undefined) mapped.start_date = updates.startDate;
  if (updates.endDate !== undefined) mapped.end_date = updates.endDate;
  if (updates.status !== undefined) mapped.status = updates.status;
  if (updates.totalBudget !== undefined) mapped.total_budget = updates.totalBudget;

  const { data, error } = await supabase.from('projects').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return toProject(data);
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return !error;
}

// ─── Budget Categories ────────────────────────────────────────
export async function getCategoriesByProject(projectId: string): Promise<BudgetCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('budget_categories').select('*').eq('project_id', projectId);
  if (error) throw error;
  return (data || []).map(toCategory);
}

export async function createCategory(category: BudgetCategory): Promise<BudgetCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('budget_categories').insert({
    id: category.id,
    project_id: category.projectId,
    name: category.name,
    code: category.code,
    budgeted_amount: category.budgetedAmount,
    parent_category_id: category.parentCategoryId || null,
  }).select().single();
  if (error) throw error;
  return toCategory(data);
}

export async function createCategoriesBatch(categories: BudgetCategory[]): Promise<BudgetCategory[]> {
  const supabase = await createClient();
  const rows = categories.map((c) => ({
    id: c.id,
    project_id: c.projectId,
    name: c.name,
    code: c.code,
    budgeted_amount: c.budgetedAmount,
    parent_category_id: c.parentCategoryId || null,
  }));
  const { data, error } = await supabase.from('budget_categories').insert(rows).select();
  if (error) throw error;
  return (data || []).map(toCategory);
}

export async function updateCategory(id: string, updates: Partial<BudgetCategory>): Promise<BudgetCategory | null> {
  const supabase = await createClient();
  const mapped: Record<string, unknown> = {};
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.code !== undefined) mapped.code = updates.code;
  if (updates.budgetedAmount !== undefined) mapped.budgeted_amount = updates.budgetedAmount;

  const { data, error } = await supabase.from('budget_categories').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return toCategory(data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('budget_categories').delete().eq('id', id);
  return !error;
}

// ─── Cost Entries ─────────────────────────────────────────────
export async function getCostsByProject(projectId: string): Promise<CostEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cost_entries').select('*').eq('project_id', projectId).order('entry_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(toCostEntry);
}

export async function getCostById(id: string): Promise<CostEntry | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cost_entries').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  return toCostEntry(data);
}

export async function createCostEntry(entry: CostEntry): Promise<CostEntry> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cost_entries').insert({
    id: entry.id,
    project_id: entry.projectId,
    category_id: entry.categoryId,
    vendor_id: entry.vendorId || null,
    description: entry.description,
    amount: entry.amount,
    entry_date: entry.entryDate,
    payment_status: entry.paymentStatus,
    entry_type: entry.entryType,
    created_by: entry.createdBy,
  }).select().single();
  if (error) throw error;
  return toCostEntry(data);
}

export async function updateCostEntry(id: string, updates: Partial<CostEntry>): Promise<CostEntry | null> {
  const supabase = await createClient();
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.amount !== undefined) mapped.amount = updates.amount;
  if (updates.entryDate !== undefined) mapped.entry_date = updates.entryDate;
  if (updates.paymentStatus !== undefined) mapped.payment_status = updates.paymentStatus;
  if (updates.entryType !== undefined) mapped.entry_type = updates.entryType;
  if (updates.categoryId !== undefined) mapped.category_id = updates.categoryId;
  if (updates.vendorId !== undefined) mapped.vendor_id = updates.vendorId;

  const { data, error } = await supabase.from('cost_entries').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return toCostEntry(data);
}

export async function deleteCostEntry(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('cost_entries').delete().eq('id', id);
  return !error;
}

// ─── Vendors ──────────────────────────────────────────────────
export async function getVendors(): Promise<Vendor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vendors').select('*').order('name');
  if (error) throw error;
  return (data || []).map(toVendor);
}

export async function createVendor(vendor: Vendor): Promise<Vendor> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vendors').insert({
    id: vendor.id,
    name: vendor.name,
    contact_name: vendor.contactName,
    phone: vendor.phone,
    email: vendor.email || null,
    trade: vendor.trade,
  }).select().single();
  if (error) throw error;
  return toVendor(data);
}

export async function updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
  const supabase = await createClient();
  const mapped: Record<string, unknown> = {};
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.contactName !== undefined) mapped.contact_name = updates.contactName;
  if (updates.phone !== undefined) mapped.phone = updates.phone;
  if (updates.email !== undefined) mapped.email = updates.email;
  if (updates.trade !== undefined) mapped.trade = updates.trade;

  const { data, error } = await supabase.from('vendors').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return toVendor(data);
}

export async function deleteVendor(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('vendors').delete().eq('id', id);
  return !error;
}

// ─── Change Orders ────────────────────────────────────────────
export async function getChangeOrdersByProject(projectId: string): Promise<ChangeOrder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('change_orders').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toChangeOrder);
}

export async function createChangeOrder(order: ChangeOrder): Promise<ChangeOrder> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('change_orders').insert({
    id: order.id,
    project_id: order.projectId,
    description: order.description,
    amount: order.amount,
    status: order.status,
    requested_date: order.requestedDate,
    approved_date: order.approvedDate || null,
    created_by: order.createdBy,
  }).select().single();
  if (error) throw error;
  return toChangeOrder(data);
}

export async function updateChangeOrder(id: string, updates: Partial<ChangeOrder>): Promise<ChangeOrder | null> {
  const supabase = await createClient();
  const mapped: Record<string, unknown> = {};
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.amount !== undefined) mapped.amount = updates.amount;
  if (updates.status !== undefined) mapped.status = updates.status;
  if (updates.approvedDate !== undefined) mapped.approved_date = updates.approvedDate;

  const { data, error } = await supabase.from('change_orders').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return toChangeOrder(data);
}

export async function deleteChangeOrder(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('change_orders').delete().eq('id', id);
  return !error;
}

// ─── Notifications ────────────────────────────────────────────
export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toNotification);
}

// ─── Cost Items ───────────────────────────────────────────────
export async function getCostItemsByProject(projectId: string): Promise<CostItemWithTotal[]> {
  const supabase = await createClient();

  // Fetch cost_items and cost_entries in PARALLEL (was sequential before)
  const [itemsResult, costsResult] = await Promise.all([
    supabase.from('cost_items').select('*').eq('project_id', projectId),
    supabase.from('cost_entries').select('id, category_id, amount, description, entry_type').eq('project_id', projectId),
  ]);

  if (itemsResult.error) throw itemsResult.error;

  let costItems = (itemsResult.data || []).map(toCostItem);

  // Auto-seed default cost items ONLY if none exist (lazy init)
  if (costItems.length === 0) {
    const { data: catRows } = await supabase.from('budget_categories').select('id').eq('project_id', projectId).limit(1);
    if (catRows && catRows.length > 0) {
      const firstCatId = catRows[0].id as string;
      const defaultTemplates = [
        { name: 'Cement (ሲምንቶ)', nameAm: 'ሲምንቶ', icon: '🧱', unit: 'bags' },
        { name: 'Rebar Steel (ብረት)', nameAm: 'የህንፃ ብረት', icon: '🔩', unit: 'kg' },
        { name: 'Sand & Gravel (አሸዋ)', nameAm: 'አሸዋ እና ጠጠር', icon: '🪨', unit: 'm³' },
        { name: 'Daily Labor (የሰው ኃይል)', nameAm: 'የሰው ኃይል', icon: '👷', unit: 'days' },
        { name: 'Transport (ትራንስፖርት)', nameAm: 'ትራንስፖርት', icon: '🚛', unit: 'trips' },
      ];

      const toInsert = defaultTemplates.map((t) => ({
        project_id: projectId,
        category_id: firstCatId,
        name: t.name,
        name_am: t.nameAm,
        icon: t.icon,
        unit: t.unit,
        usage_count: 0,
      }));

      const { data: seeded } = await supabase.from('cost_items').insert(toInsert).select();
      if (seeded) {
        costItems = seeded.map(toCostItem);
      }
    }
  }

  // Build cost totals using a Map for O(1) lookups instead of O(N×M) filter+includes
  const costEntries = (costsResult.data || []);
  const itemTotalsMap = new Map<string, { total: number; count: number }>();

  for (const item of costItems) {
    itemTotalsMap.set(item.id, { total: 0, count: 0 });
  }

  const itemNameIndex = new Map<string, string[]>();
  for (const item of costItems) {
    const firstWord = item.name.split(' ')[0].toLowerCase();
    if (!itemNameIndex.has(firstWord)) {
      itemNameIndex.set(firstWord, []);
    }
    itemNameIndex.get(firstWord)!.push(item.id);
  }

  for (const cost of costEntries) {
    const desc = (cost.description as string || '').toLowerCase();
    for (const item of costItems) {
      if (cost.category_id === item.categoryId && desc.includes(item.name.split(' ')[0].toLowerCase())) {
        const entry = itemTotalsMap.get(item.id)!;
        entry.total += Number(cost.amount);
        entry.count += 1;
      }
    }
  }

  return costItems
    .map((item) => {
      const totals = itemTotalsMap.get(item.id) || { total: 0, count: 0 };
      return {
        ...item,
        totalSpent: totals.total,
        entryCount: totals.count,
      };
    })
    .sort((a, b) => b.usageCount - a.usageCount);
}

export async function createCostItem(item: CostItem): Promise<CostItem> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cost_items').insert({
    id: item.id,
    project_id: item.projectId,
    name: item.name,
    name_am: item.nameAm || null,
    category_id: item.categoryId,
    vendor_id: item.vendorId || null,
    icon: item.icon,
    unit: item.unit || null,
    usage_count: item.usageCount,
  }).select().single();
  if (error) throw error;
  return toCostItem(data);
}

export async function incrementCostItemUsage(id: string): Promise<void> {
  const supabase = await createClient();
  // Use RPC or manual increment
  const { data } = await supabase.from('cost_items').select('usage_count').eq('id', id).single();
  if (data) {
    await supabase.from('cost_items').update({ usage_count: Number(data.usage_count) + 1 }).eq('id', id);
  }
}

export async function updateCostItem(id: string, updates: Partial<CostItem>): Promise<CostItem | null> {
  const supabase = await createClient();
  const mapped: Record<string, unknown> = {};
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.nameAm !== undefined) mapped.name_am = updates.nameAm;
  if (updates.categoryId !== undefined) mapped.category_id = updates.categoryId;
  if (updates.icon !== undefined) mapped.icon = updates.icon;
  if (updates.unit !== undefined) mapped.unit = updates.unit;

  const { data, error } = await supabase.from('cost_items').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return toCostItem(data);
}

export async function deleteCostItem(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('cost_items').delete().eq('id', id);
  return !error;
}

// ─── Project Summary (computed) ───────────────────────────────
export async function getProjectSummary(projectId: string): Promise<ProjectSummary | null> {
  const supabase = await createClient();

  // Fetch project, categories, and costs in PARALLEL (was 3 sequential queries)
  const [projectResult, catResult, costResult] = await Promise.all([
    supabase.from('projects').select('*').eq('id', projectId).single(),
    supabase.from('budget_categories').select('*').eq('project_id', projectId),
    supabase.from('cost_entries').select('*').eq('project_id', projectId),
  ]);

  if (!projectResult.data) return null;
  const project = toProject(projectResult.data);
  const categories = (catResult.data || []).map(toCategory);
  const costs = (costResult.data || []).map(toCostEntry);

  const totalBudget = categories.reduce((sum, c) => sum + c.budgetedAmount, 0);
  const totalSpent = costs.reduce((sum, e) => sum + (e.entryType === 'credit' ? -e.amount : e.amount), 0);

  const categorySummaries: CategorySummary[] = categories.map((cat) => {
    const catCosts = costs.filter((e) => e.categoryId === cat.id);
    const actualSpent = catCosts.reduce((sum, e) => sum + (e.entryType === 'credit' ? -e.amount : e.amount), 0);
    return {
      category: cat,
      actualSpent,
      variance: cat.budgetedAmount - actualSpent,
      percentUsed: cat.budgetedAmount > 0 ? Math.round((actualSpent / cat.budgetedAmount) * 1000) / 10 : 0,
    };
  });

  const recentCosts = costs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    project,
    totalBudget,
    totalSpent,
    totalRemaining: totalBudget - totalSpent,
    percentUsed: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 1000) / 10 : 0,
    categories: categorySummaries,
    recentCosts,
    costCount: costs.length,
  };
}

// ─── All Projects Summary (for dashboard) ─────────────────────
export async function getAllProjectSummaries(): Promise<ProjectSummary[]> {
  const supabase = await createClient();

  // Fetch ALL three tables in PARALLEL (was 3 sequential queries)
  const [projectResult, catResult, costResult] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('budget_categories').select('*'),
    supabase.from('cost_entries').select('*'),
  ]);

  const projectRows = projectResult.data;
  if (!projectRows || projectRows.length === 0) return [];

  const allCategories = (catResult.data || []).map(toCategory);
  const allCosts = (costResult.data || []).map(toCostEntry);

  // Pre-index categories and costs by projectId for O(1) lookups
  const catByProject = new Map<string, BudgetCategory[]>();
  for (const cat of allCategories) {
    if (!catByProject.has(cat.projectId)) catByProject.set(cat.projectId, []);
    catByProject.get(cat.projectId)!.push(cat);
  }

  const costsByProject = new Map<string, CostEntry[]>();
  for (const cost of allCosts) {
    if (!costsByProject.has(cost.projectId)) costsByProject.set(cost.projectId, []);
    costsByProject.get(cost.projectId)!.push(cost);
  }

  return projectRows.map((row) => {
    const project = toProject(row);
    const categories = catByProject.get(project.id) || [];
    const costs = costsByProject.get(project.id) || [];

    const totalBudget = categories.reduce((sum, c) => sum + c.budgetedAmount, 0);
    const totalSpent = costs.reduce((sum, e) => sum + (e.entryType === 'credit' ? -e.amount : e.amount), 0);

    const categorySummaries: CategorySummary[] = categories.map((cat) => {
      const catCosts = costs.filter((e) => e.categoryId === cat.id);
      const actualSpent = catCosts.reduce((sum, e) => sum + (e.entryType === 'credit' ? -e.amount : e.amount), 0);
      return {
        category: cat,
        actualSpent,
        variance: cat.budgetedAmount - actualSpent,
        percentUsed: cat.budgetedAmount > 0 ? Math.round((actualSpent / cat.budgetedAmount) * 1000) / 10 : 0,
      };
    });

    const recentCosts = costs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      project,
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      percentUsed: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 1000) / 10 : 0,
      categories: categorySummaries,
      recentCosts,
      costCount: costs.length,
    };
  });
}
