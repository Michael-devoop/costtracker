import { promises as fs } from 'fs';
import path from 'path';
import type { Database, Project, BudgetCategory, CostEntry, Vendor, ChangeOrder, Notification, CostItem, CostItemWithTotal, ProjectSummary, CategorySummary } from '@/types';

// ─── Database Path ────────────────────────────────────────────
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// ─── Core Read/Write ──────────────────────────────────────────
export async function readDB(): Promise<Database> {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDB(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Projects ─────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  const db = await readDB();
  return db.projects;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const db = await readDB();
  return db.projects.find((p) => p.id === id);
}

export async function createProject(project: Project): Promise<Project> {
  const db = await readDB();
  db.projects.push(project);
  await writeDB(db);
  return project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const db = await readDB();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.projects[index] = { ...db.projects[index], ...updates, updatedAt: new Date().toISOString() };
  await writeDB(db);
  return db.projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  // Also clean up related data
  db.budgetCategories = db.budgetCategories.filter((c) => c.projectId !== id);
  db.costEntries = db.costEntries.filter((e) => e.projectId !== id);
  db.changeOrders = db.changeOrders.filter((o) => o.projectId !== id);
  await writeDB(db);
  return db.projects.length < before;
}

// ─── Budget Categories ────────────────────────────────────────
export async function getCategoriesByProject(projectId: string): Promise<BudgetCategory[]> {
  const db = await readDB();
  return db.budgetCategories.filter((c) => c.projectId === projectId);
}

export async function createCategory(category: BudgetCategory): Promise<BudgetCategory> {
  const db = await readDB();
  db.budgetCategories.push(category);
  await writeDB(db);
  return category;
}

export async function updateCategory(id: string, updates: Partial<BudgetCategory>): Promise<BudgetCategory | null> {
  const db = await readDB();
  const index = db.budgetCategories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.budgetCategories[index] = { ...db.budgetCategories[index], ...updates };
  await writeDB(db);
  return db.budgetCategories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.budgetCategories.length;
  db.budgetCategories = db.budgetCategories.filter((c) => c.id !== id);
  await writeDB(db);
  return db.budgetCategories.length < before;
}

// ─── Cost Entries ─────────────────────────────────────────────
export async function getCostsByProject(projectId: string): Promise<CostEntry[]> {
  const db = await readDB();
  return db.costEntries
    .filter((e) => e.projectId === projectId)
    .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
}

export async function getCostById(id: string): Promise<CostEntry | undefined> {
  const db = await readDB();
  return db.costEntries.find((e) => e.id === id);
}

export async function createCostEntry(entry: CostEntry): Promise<CostEntry> {
  const db = await readDB();
  db.costEntries.push(entry);
  await writeDB(db);
  return entry;
}

export async function updateCostEntry(id: string, updates: Partial<CostEntry>): Promise<CostEntry | null> {
  const db = await readDB();
  const index = db.costEntries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  db.costEntries[index] = { ...db.costEntries[index], ...updates, updatedAt: new Date().toISOString() };
  await writeDB(db);
  return db.costEntries[index];
}

export async function deleteCostEntry(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.costEntries.length;
  db.costEntries = db.costEntries.filter((e) => e.id !== id);
  await writeDB(db);
  return db.costEntries.length < before;
}

// ─── Vendors ──────────────────────────────────────────────────
export async function getVendors(): Promise<Vendor[]> {
  const db = await readDB();
  return db.vendors;
}

export async function createVendor(vendor: Vendor): Promise<Vendor> {
  const db = await readDB();
  db.vendors.push(vendor);
  await writeDB(db);
  return vendor;
}

export async function updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
  const db = await readDB();
  const index = db.vendors.findIndex((v) => v.id === id);
  if (index === -1) return null;
  db.vendors[index] = { ...db.vendors[index], ...updates };
  await writeDB(db);
  return db.vendors[index];
}

export async function deleteVendor(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.vendors.length;
  db.vendors = db.vendors.filter((v) => v.id !== id);
  await writeDB(db);
  return db.vendors.length < before;
}

// ─── Change Orders ────────────────────────────────────────────
export async function getChangeOrdersByProject(projectId: string): Promise<ChangeOrder[]> {
  const db = await readDB();
  return db.changeOrders.filter((o) => o.projectId === projectId);
}

export async function createChangeOrder(order: ChangeOrder): Promise<ChangeOrder> {
  const db = await readDB();
  db.changeOrders.push(order);
  await writeDB(db);
  return order;
}

export async function updateChangeOrder(id: string, updates: Partial<ChangeOrder>): Promise<ChangeOrder | null> {
  const db = await readDB();
  const index = db.changeOrders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.changeOrders[index] = { ...db.changeOrders[index], ...updates };
  await writeDB(db);
  return db.changeOrders[index];
}

export async function deleteChangeOrder(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.changeOrders.length;
  db.changeOrders = db.changeOrders.filter((o) => o.id !== id);
  await writeDB(db);
  return db.changeOrders.length < before;
}

// ─── Notifications ────────────────────────────────────────────
export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const db = await readDB();
  return db.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Cost Items ───────────────────────────────────────────────
export async function getCostItemsByProject(projectId: string): Promise<CostItemWithTotal[]> {
  const db = await readDB();
  const items = db.costItems.filter((i) => i.projectId === projectId);
  const costs = db.costEntries.filter((e) => e.projectId === projectId);

  return items
    .map((item) => {
      const itemCosts = costs.filter(
        (c) => c.categoryId === item.categoryId && c.description.toLowerCase().includes(item.name.toLowerCase())
      );
      return {
        ...item,
        totalSpent: itemCosts.reduce((s, c) => s + c.amount, 0),
        entryCount: itemCosts.length,
      };
    })
    .sort((a, b) => b.usageCount - a.usageCount);
}

export async function createCostItem(item: CostItem): Promise<CostItem> {
  const db = await readDB();
  db.costItems.push(item);
  await writeDB(db);
  return item;
}

export async function incrementCostItemUsage(id: string): Promise<void> {
  const db = await readDB();
  const item = db.costItems.find((i) => i.id === id);
  if (item) {
    item.usageCount += 1;
    await writeDB(db);
  }
}

export async function deleteCostItem(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.costItems.length;
  db.costItems = db.costItems.filter((i) => i.id !== id);
  await writeDB(db);
  return db.costItems.length < before;
}

// ─── Project Summary (computed) ───────────────────────────────
export async function getProjectSummary(projectId: string): Promise<ProjectSummary | null> {
  const db = await readDB();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const categories = db.budgetCategories.filter((c) => c.projectId === projectId);
  const costs = db.costEntries.filter((e) => e.projectId === projectId);

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
  const db = await readDB();
  const summaries: ProjectSummary[] = [];

  for (const project of db.projects) {
    const categories = db.budgetCategories.filter((c) => c.projectId === project.id);
    const costs = db.costEntries.filter((e) => e.projectId === project.id);

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

    summaries.push({
      project,
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      percentUsed: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 1000) / 10 : 0,
      categories: categorySummaries,
      recentCosts,
      costCount: costs.length,
    });
  }

  return summaries;
}
