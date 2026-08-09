-- ============================================================
-- CostTracker — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── Projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  total_budget NUMERIC NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Budget Categories ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  budgeted_amount NUMERIC NOT NULL DEFAULT 0,
  parent_category_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Vendors ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT,
  trade TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Cost Entries ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cost_entries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  vendor_id TEXT REFERENCES vendors(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  entry_date TEXT NOT NULL DEFAULT '',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  entry_type TEXT NOT NULL DEFAULT 'expense' CHECK (entry_type IN ('expense', 'credit', 'adjustment')),
  created_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Attachments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cost_entry_id TEXT NOT NULL REFERENCES cost_entries(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Change Orders ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS change_orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_date TEXT NOT NULL DEFAULT '',
  approved_date TEXT,
  created_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Cost Items (reusable templates) ───────────────────────────
CREATE TABLE IF NOT EXISTS cost_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_am TEXT,
  category_id TEXT NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  vendor_id TEXT REFERENCES vendors(id) ON DELETE SET NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  unit TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'alert')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_budget_categories_project ON budget_categories(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_project ON cost_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_category ON cost_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_change_orders_project ON change_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_items_project ON cost_items(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_attachments_entry ON attachments(cost_entry_id);

-- ─── Row Level Security (RLS) — Enable but allow all for now ──
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (tighten later per role)
CREATE POLICY "Authenticated users can do everything" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON budget_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON vendors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON cost_entries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON attachments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON change_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON cost_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything" ON notifications FOR ALL USING (auth.role() = 'authenticated');
