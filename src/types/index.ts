// ─── User & Auth ───────────────────────────────────────────────
export type UserRole = 'admin' | 'project_manager' | 'supervisor' | 'accountant' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// ─── Projects ──────────────────────────────────────────────────
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  address: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  totalBudget: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Budget Categories ─────────────────────────────────────────
export interface BudgetCategory {
  id: string;
  projectId: string;
  name: string;
  code: string;
  budgetedAmount: number;
  parentCategoryId?: string;
  createdAt: string;
}

// ─── Vendors ───────────────────────────────────────────────────
export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email?: string;
  trade: string;
  createdAt: string;
}

// ─── Cost Entries ──────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type EntryType = 'expense' | 'credit' | 'adjustment';

export interface CostEntry {
  id: string;
  projectId: string;
  categoryId: string;
  vendorId?: string;
  description: string;
  amount: number;
  entryDate: string;
  paymentStatus: PaymentStatus;
  entryType: EntryType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Attachments ───────────────────────────────────────────────
export interface Attachment {
  id: string;
  costEntryId: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  createdAt: string;
}

// ─── Change Orders ─────────────────────────────────────────────
export type ChangeOrderStatus = 'pending' | 'approved' | 'rejected';

export interface ChangeOrder {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  status: ChangeOrderStatus;
  requestedDate: string;
  approvedDate?: string;
  createdBy: string;
  createdAt: string;
}

// ─── Notifications ─────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  projectId?: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'alert';
  createdAt: string;
}

// ─── Cost Items (reusable templates) ───────────────────────────
export interface CostItem {
  id: string;
  projectId: string;
  name: string;
  nameAm?: string;       // Amharic name
  categoryId: string;
  vendorId?: string;      // Default vendor
  icon: string;           // Emoji icon
  unit?: string;          // "kg", "bags", "pieces", "days"
  usageCount: number;
  createdAt: string;
}

// ─── Computed / API Response Types ─────────────────────────────
export interface CategorySummary {
  category: BudgetCategory;
  actualSpent: number;
  variance: number;
  percentUsed: number;
}

export interface ProjectSummary {
  project: Project;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentUsed: number;
  categories: CategorySummary[];
  recentCosts: CostEntry[];
  costCount: number;
}

export interface CostItemWithTotal extends CostItem {
  totalSpent: number;
  entryCount: number;
}

// ─── Database Shape ────────────────────────────────────────────
export interface Database {
  users: User[];
  projects: Project[];
  budgetCategories: BudgetCategory[];
  vendors: Vendor[];
  costEntries: CostEntry[];
  costItems: CostItem[];
  attachments: Attachment[];
  changeOrders: ChangeOrder[];
  notifications: Notification[];
}
