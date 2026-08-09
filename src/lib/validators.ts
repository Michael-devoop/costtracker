// ─── Input Validation ──────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate project creation/update input.
 */
export function validateProject(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Project name must be at least 2 characters' });
  }

  if (!data.clientName || typeof data.clientName !== 'string' || data.clientName.trim().length < 2) {
    errors.push({ field: 'clientName', message: 'Client name is required' });
  }

  if (data.totalBudget !== undefined) {
    const budget = Number(data.totalBudget);
    if (isNaN(budget) || budget < 0) {
      errors.push({ field: 'totalBudget', message: 'Budget must be a positive number' });
    }
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate as string);
    const end = new Date(data.endDate as string);
    if (end < start) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate cost entry input.
 */
export function validateCostEntry(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 2) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  const amount = Number(data.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be a positive number' });
  }

  if (!data.categoryId || typeof data.categoryId !== 'string') {
    errors.push({ field: 'categoryId', message: 'Category is required' });
  }

  if (!data.projectId || typeof data.projectId !== 'string') {
    errors.push({ field: 'projectId', message: 'Project is required' });
  }

  if (!data.entryDate || typeof data.entryDate !== 'string') {
    errors.push({ field: 'entryDate', message: 'Date is required' });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate budget category input.
 */
export function validateCategory(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Category name is required' });
  }

  if (!data.code || typeof data.code !== 'string' || data.code.trim().length < 2) {
    errors.push({ field: 'code', message: 'Category code is required (min 2 chars)' });
  }

  const budgetedAmount = Number(data.budgetedAmount);
  if (isNaN(budgetedAmount) || budgetedAmount < 0) {
    errors.push({ field: 'budgetedAmount', message: 'Budgeted amount must be a non-negative number' });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate vendor input.
 */
export function validateVendor(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Vendor name is required' });
  }

  if (!data.trade || typeof data.trade !== 'string' || data.trade.trim().length < 2) {
    errors.push({ field: 'trade', message: 'Trade/specialty is required' });
  }

  if (data.phone && typeof data.phone === 'string') {
    const phoneClean = data.phone.replace(/[\s\-\(\)]/g, '');
    if (phoneClean.length < 7) {
      errors.push({ field: 'phone', message: 'Invalid phone number' });
    }
  }

  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email address' });
    }
  }

  return { valid: errors.length === 0, errors };
}
