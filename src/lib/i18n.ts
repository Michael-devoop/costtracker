// ─── Internationalization ──────────────────────────────────────

export type Locale = 'en' | 'am';

export interface Translations {
  [key: string]: string;
}

const en: Translations = {
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.projects': 'Projects',
  'nav.reports': 'Reports',
  'nav.users': 'Users',
  'nav.settings': 'Settings',
  'nav.search': 'Search...',
  'nav.mainMenu': 'Main Menu',

  // Common
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.close': 'Close',
  'common.loading': 'Loading...',
  'common.noData': 'No data',
  'common.viewAll': 'View all',
  'common.total': 'Total',
  'common.back': 'Back',
  'common.confirm': 'Confirm',
  'common.yes': 'Yes',
  'common.no': 'No',

  // Auth
  'auth.signIn': 'Sign In',
  'auth.signOut': 'Sign Out',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.welcomeBack': 'Welcome back',
  'auth.signInTo': 'Sign in to CostTracker',
  'auth.rememberMe': 'Remember me',
  'auth.profile': 'Profile & Settings',
  'auth.firstName': 'First Name',
  'auth.lastName': 'Last Name',
  'auth.role': 'Role',

  // User Management
  'users.title': 'User Management',
  'users.subtitle': 'Manage team members and access',
  'users.addUser': 'Add User',
  'users.noUsers': 'No users yet',
  'users.noUsersDesc': 'Add team members to start collaborating.',
  'users.fullName': 'Full Name',
  'users.email': 'Email',
  'users.role': 'Role',
  'users.password': 'Password',
  'users.created': 'Created',
  'users.actions': 'Actions',
  'users.addSuccess': 'User added successfully!',
  'users.deleteConfirm': 'Are you sure you want to delete this user?',
  'users.deleteSuccess': 'User deleted successfully.',

  // Dashboard
  'dashboard.title': 'Portfolio Dashboard',
  'dashboard.subtitle': 'Overview of all your construction projects',
  'dashboard.totalBudget': 'Total Budget',
  'dashboard.totalSpent': 'Total Spent',
  'dashboard.remaining': 'Remaining',
  'dashboard.projects': 'Projects',
  'dashboard.active': 'active',
  'dashboard.entries': 'entries',
  'dashboard.budgetUsed': 'Budget Used',

  // Projects
  'projects.title': 'Projects',
  'projects.subtitle': 'Manage your construction projects',
  'projects.newProject': 'New Project',
  'projects.client': 'Client',
  'projects.status': 'Status',
  'projects.budget': 'Budget',
  'projects.startDate': 'Start Date',
  'projects.location': 'Location',
  'projects.overallProgress': 'Overall Budget Progress',
  'projects.deleteConfirm': 'Are you sure you want to delete this project? All associated costs and categories will be permanently removed.',

  // Statuses
  'status.active': 'Active',
  'status.planning': 'Planning',
  'status.on_hold': 'On Hold',
  'status.completed': 'Completed',
  'status.cancelled': 'Cancelled',
  'status.pending': 'Pending',
  'status.paid': 'Paid',
  'status.overdue': 'Overdue',
  'status.approved': 'Approved',
  'status.rejected': 'Rejected',

  // Cost Entries
  'costs.title': 'Cost Entries',
  'costs.addEntry': 'Add Cost Entry',
  'costs.addCost': 'Add Cost',
  'costs.quickAdd': 'Quick Add',
  'costs.description': 'Description',
  'costs.amount': 'Amount',
  'costs.date': 'Date',
  'costs.category': 'Category',
  'costs.vendor': 'Vendor',
  'costs.vendorOptional': 'Vendor (optional)',
  'costs.type': 'Type',
  'costs.paymentStatus': 'Payment Status',
  'costs.expense': 'Expense',
  'costs.credit': 'Credit',
  'costs.adjustment': 'Adjustment',
  'costs.noEntries': 'No cost entries yet',
  'costs.noEntriesDesc': 'Start logging expenses to track your project budget.',
  'costs.updateEntry': 'Update Entry',
  'costs.selectCategory': 'Select category...',
  'costs.noVendor': 'No vendor',
  'costs.deleteConfirm': 'Are you sure you want to delete this cost entry?',
  'costs.entriesLogged': 'entries logged',
  'costs.recentCosts': 'Recent Costs',

  // Cost Items (Quick Add)
  'costItems.title': 'Quick Add Items',
  'costItems.subtitle': 'Tap an item to log a cost quickly',
  'costItems.enterAmount': 'Enter Amount',
  'costItems.totalSpent': 'total spent',
  'costItems.times': 'times',
  'costItems.addNew': 'Add New Item',
  'costItems.itemName': 'Item Name',
  'costItems.selectIcon': 'Select Icon',

  // Categories
  'categories.title': 'Budget Categories',
  'categories.code': 'Code',
  'categories.name': 'Category Name',
  'categories.budgeted': 'Budgeted Amount',
  'categories.pctTotal': '% of Total',
  'categories.totalBudgeted': 'total budgeted',

  // Budget Chart
  'chart.budgetVsActual': 'Budget vs. Actual by Category',
  'chart.actualSpent': 'Actual Spent',
  'chart.budgeted': 'Budgeted',
  'chart.variance': 'Variance',
  'chart.pctUsed': '% Used',

  // Vendors
  'vendors.title': 'Vendors',
  'vendors.subtitle': 'vendors / subcontractors',

  // Change Orders
  'changeOrders.title': 'Change Orders',
  'changeOrders.noOrders': 'No change orders',
  'changeOrders.noOrdersDesc': 'Change orders will appear here when submitted.',

  // Reports
  'reports.title': 'Reports',
  'reports.budgetSummary': 'Budget Summary',
  'reports.budgetAnalysis': 'Budget Analysis',
  'reports.chartTitle': 'Budget vs. Actual Chart',
  'reports.exportPDF': 'Download PDF',
  'reports.exportExcel': 'Download Excel',
  'reports.generating': 'Generating...',
  'reports.exportSection': 'Export Reports',
  'reports.exportDesc': 'Download project data as PDF or Excel file',
  'reports.costEntries': 'Cost Entries',
  'reports.changeOrders': 'Change Orders',
  'reports.projectInfo': 'Project Info',

  // Settings
  'settings.title': 'Settings',
  'settings.subtitle': 'Manage your account and preferences',
  'settings.profile': 'Profile',
  'settings.preferences': 'Preferences',
  'settings.notifications': 'Notifications',
  'settings.fullName': 'Full Name',
  'settings.currency': 'Currency',
  'settings.dateFormat': 'Date Format',
  'settings.language': 'Language',
  'settings.budgetOverrun': 'Budget overrun alerts',
  'settings.budgetOverrunDesc': 'Get notified when a category exceeds 90% of budget',
  'settings.costUpdates': 'Cost entry updates',
  'settings.costUpdatesDesc': 'Notify when team members log new costs',
  'settings.changeOrderAlerts': 'Change order submissions',
  'settings.changeOrderAlertsDesc': 'Alert when a change order is submitted',
  'settings.weeklyReport': 'Weekly summary report',
  'settings.weeklyReportDesc': 'Receive a weekly email with project summaries',

  // Roles
  'role.admin': 'Admin',
  'role.project_manager': 'Project Manager',
  'role.supervisor': 'Site Supervisor',
  'role.accountant': 'Accountant',
  'role.viewer': 'Viewer',



  // Settings - additional
  'settings.saveProfile': 'Save Profile',
  'settings.profileUpdated': 'Profile updated successfully!',
  'settings.changePassword': 'Change Password',
  'settings.newPassword': 'New Password',
  'settings.confirmPassword': 'Confirm Password',
  'settings.updatePassword': 'Update Password',
  'settings.passwordUpdated': 'Password updated successfully!',
  'settings.passwordMismatch': 'Passwords do not match',
  'settings.passwordTooShort': 'Password must be at least 6 characters',
  'settings.dangerZone': 'Danger Zone',
  'settings.signOutDesc': 'Sign out from your account on this device.',

  // Empty States
  'empty.noProjects': 'No projects yet',
  'empty.noProjectsDesc': 'Create your first project to start tracking construction costs.',
};

const am: Translations = {
  // Navigation
  'nav.dashboard': 'ዳሽቦርድ',
  'nav.projects': 'ፕሮጀክቶች',
  'nav.reports': 'ሪፖርቶች',
  'nav.users': 'ተጠቃሚዎች',
  'nav.settings': 'ቅንብሮች',
  'nav.search': 'ፈልግ...',
  'nav.mainMenu': 'ዋና ምናሌ',

  // Common
  'common.save': 'አስቀምጥ',
  'common.cancel': 'ሰርዝ',
  'common.delete': 'ሰርዝ',
  'common.edit': 'አርትዕ',
  'common.add': 'ጨምር',
  'common.close': 'ዝጋ',
  'common.loading': 'በመጫን ላይ...',
  'common.noData': 'ምንም ዳታ የለም',
  'common.viewAll': 'ሁሉንም ይመልከቱ',
  'common.total': 'ጠቅላላ',
  'common.back': 'ተመለስ',
  'common.confirm': 'አረጋግጥ',
  'common.yes': 'አዎ',
  'common.no': 'አይ',

  // Auth
  'auth.signIn': 'ግባ',
  'auth.signOut': 'ውጣ',
  'auth.email': 'ኢሜይል',
  'auth.password': 'የይለፍ ቃል',
  'auth.welcomeBack': 'እንኳን ደህና መጡ',
  'auth.signInTo': 'ወደ CostTracker ግባ',
  'auth.rememberMe': 'አስታውሰኝ',
  'auth.profile': 'መገለጫ እና ቅንብሮች',
  'auth.firstName': 'ስም',
  'auth.lastName': 'የአባት ስም',
  'auth.role': 'ሚና',

  // User Management
  'users.title': 'የተጠቃሚ አስተዳደር',
  'users.subtitle': 'የቡድን አባላትን እና ፈቃድ ያስተዳድሩ',
  'users.addUser': 'ተጠቃሚ ጨምር',
  'users.noUsers': 'ገና ተጠቃሚ የለም',
  'users.noUsersDesc': 'ትብብር ለመጀመር የቡድን አባላት ይጨምሩ።',
  'users.fullName': 'ሙሉ ስም',
  'users.email': 'ኢሜይል',
  'users.role': 'ሚና',
  'users.password': 'የይለፍ ቃል',
  'users.created': 'የተፈጠረ',
  'users.actions': 'ድርጊቶች',
  'users.addSuccess': 'ተጠቃሚ በተሳካ ሁኔታ ተጨምሯል!',
  'users.deleteConfirm': 'ይህን ተጠቃሚ መሰረዝ ይፈልጋሉ?',
  'users.deleteSuccess': 'ተጠቃሚ በተሳካ ሁኔታ ተሰርዟል።',

  // Dashboard
  'dashboard.title': 'ዳሽቦርድ',
  'dashboard.subtitle': 'የሁሉም ፕሮጀክቶች አጠቃላይ እይታ',
  'dashboard.totalBudget': 'ጠቅላላ በጀት',
  'dashboard.totalSpent': 'ጠቅላላ ወጪ',
  'dashboard.remaining': 'ቀሪ',
  'dashboard.projects': 'ፕሮጀክቶች',
  'dashboard.active': 'ንቁ',
  'dashboard.entries': 'ግቤቶች',
  'dashboard.budgetUsed': 'የተጠቀመ በጀት',

  // Projects
  'projects.title': 'ፕሮጀክቶች',
  'projects.subtitle': 'ፕሮጀክቶችህን አስተዳድር',
  'projects.newProject': 'አዲስ ፕሮጀክት',
  'projects.client': 'ደንበኛ',
  'projects.status': 'ሁኔታ',
  'projects.budget': 'በጀት',
  'projects.startDate': 'የጀመሩበት ቀን',
  'projects.location': 'ቦታ',
  'projects.overallProgress': 'አጠቃላይ የበጀት ሂደት',

  // Statuses
  'status.active': 'ንቁ',
  'status.planning': 'በእቅድ ላይ',
  'status.on_hold': 'ተይዟል',
  'status.completed': 'ተጠናቋል',
  'status.cancelled': 'ተሰርዟል',
  'status.pending': 'በመጠባበቅ',
  'status.paid': 'ተከፍሏል',
  'status.overdue': 'ያለፈበት',
  'status.approved': 'ፀድቋል',
  'status.rejected': 'ተቀባይነት አላገኘም',

  // Cost Entries
  'costs.title': 'ወጪዎች',
  'costs.addEntry': 'ወጪ ጨምር',
  'costs.addCost': 'ወጪ ጨምር',
  'costs.quickAdd': 'ፈጣን ጨምር',
  'costs.description': 'ማብራሪያ',
  'costs.amount': 'መጠን',
  'costs.date': 'ቀን',
  'costs.category': 'ምድብ',
  'costs.vendor': 'አቅራቢ',
  'costs.vendorOptional': 'አቅራቢ (አማራጭ)',
  'costs.type': 'ዓይነት',
  'costs.paymentStatus': 'የክፍያ ሁኔታ',
  'costs.expense': 'ወጪ',
  'costs.credit': 'ክሬዲት',
  'costs.adjustment': 'ማስተካከያ',
  'costs.noEntries': 'ገና ወጪ አልተመዘገበም',
  'costs.noEntriesDesc': 'በጀትዎን ለመከታተል ወጪዎችን ማስገባት ይጀምሩ።',
  'costs.updateEntry': 'ወጪ አዘምን',
  'costs.selectCategory': 'ምድብ ምረጥ...',
  'costs.noVendor': 'አቅራቢ የለም',
  'costs.deleteConfirm': 'ይህን ወጪ ለመሰረዝ እርግጠኛ ነዎት?',
  'costs.entriesLogged': 'ግቤቶች ተመዝግበዋል',
  'costs.recentCosts': 'የቅርብ ወጪዎች',

  // Cost Items (Quick Add)
  'costItems.title': 'ፈጣን ጨምር ዝርዝሮች',
  'costItems.subtitle': 'ወጪ ለማስገባት ዕቃ ይንኩ',
  'costItems.enterAmount': 'መጠን ያስገቡ',
  'costItems.totalSpent': 'ጠቅላላ ወጪ',
  'costItems.times': 'ጊዜ',
  'costItems.addNew': 'አዲስ ዕቃ ጨምር',
  'costItems.itemName': 'የዕቃ ስም',
  'costItems.selectIcon': 'ምልክት ምረጥ',

  // Categories
  'categories.title': 'የበጀት ምድቦች',
  'categories.code': 'ኮድ',
  'categories.name': 'የምድብ ስም',
  'categories.budgeted': 'የተመደበ መጠን',
  'categories.pctTotal': '% ከጠቅላላ',
  'categories.totalBudgeted': 'ጠቅላላ የተመደበ',

  // Budget Chart
  'chart.budgetVsActual': 'በጀት vs. ትክክለኛ በምድብ',
  'chart.actualSpent': 'ትክክለኛ ወጪ',
  'chart.budgeted': 'የተመደበ',
  'chart.variance': 'ልዩነት',
  'chart.pctUsed': '% ጥቅም ላይ',

  // Vendors
  'vendors.title': 'አቅራቢዎች',
  'vendors.subtitle': 'አቅራቢዎች / ንዑስ ተቋራጮች',

  // Change Orders
  'changeOrders.title': 'የለውጥ ትዕዛዞች',
  'changeOrders.noOrders': 'የለውጥ ትዕዛዝ የለም',
  'changeOrders.noOrdersDesc': 'ሲቀርቡ የለውጥ ትዕዛዞች እዚህ ይታያሉ።',

  // Reports
  'reports.title': 'ሪፖርቶች',
  'reports.budgetSummary': 'የበጀት ማጠቃለያ',
  'reports.budgetAnalysis': 'የበጀት ትንተና',
  'reports.chartTitle': 'በጀት vs. ትክክለኛ ሰንጠረዥ',

  // Settings
  'settings.title': 'ቅንብሮች',
  'settings.subtitle': 'መለያዎን እና ምርጫዎችዎን ያስተዳድሩ',
  'settings.profile': 'መገለጫ',
  'settings.preferences': 'ምርጫዎች',
  'settings.notifications': 'ማሳወቂያዎች',
  'settings.fullName': 'ሙሉ ስም',
  'settings.currency': 'ገንዘብ',
  'settings.dateFormat': 'የቀን ቅርጸት',
  'settings.language': 'ቋንቋ',
  'settings.budgetOverrun': 'የበጀት ትርፍ ማንቂያዎች',
  'settings.budgetOverrunDesc': 'ምድብ ከ90% በላይ ሲጠቀም ማሳወቂያ ያግኙ',
  'settings.costUpdates': 'የወጪ ግቤት ዝመናዎች',
  'settings.costUpdatesDesc': 'የቡድን አባላት ወጪ ሲመዘግቡ ያሳውቁ',
  'settings.changeOrderAlerts': 'የለውጥ ትዕዛዞች',
  'settings.changeOrderAlertsDesc': 'የለውጥ ትዕዛዝ ሲቀርብ ያሳውቁ',
  'settings.weeklyReport': 'ሳምንታዊ ማጠቃለያ',
  'settings.weeklyReportDesc': 'ሳምንታዊ የፕሮጀክት ማጠቃለያ በኢሜይል ያግኙ',

  // Roles
  'role.admin': 'አስተዳዳሪ',
  'role.project_manager': 'ፕሮጀክት ማናጀር',
  'role.supervisor': 'የሳይት ተቆጣጣሪ',
  'role.accountant': 'የሂሳብ ሹም',
  'role.viewer': 'ተመልካች',



  // Settings - additional
  'settings.saveProfile': 'መገለጫ አስቀምጥ',
  'settings.profileUpdated': 'መገለጫ በተሳካ ሁኔታ ተዘምኗል!',
  'settings.changePassword': 'የይለፍ ቃል ይቀይሩ',
  'settings.newPassword': 'አዲስ የይለፍ ቃል',
  'settings.confirmPassword': 'የይለፍ ቃል ያረጋግጡ',
  'settings.updatePassword': 'የይለፍ ቃል ያዘምኑ',
  'settings.passwordUpdated': 'የይለፍ ቃል በተሳካ ሁኔታ ተዘምኗል!',
  'settings.passwordMismatch': 'የይለፍ ቃሎች አይዛመዱም',
  'settings.passwordTooShort': 'የይለፍ ቃል ቢያንስ 6 ቁምፊ መሆን አለበት',
  'settings.dangerZone': 'አደጋ ዞን',
  'settings.signOutDesc': 'ከዚህ መሳሪያ ላይ ከመለያዎ ይውጡ።',

  // Empty States
  'empty.noProjects': 'ገና ፕሮጀክት የለም',
  'empty.noProjectsDesc': 'የግንባታ ወጪዎችን ለመከታተል የመጀመሪያ ፕሮጀክትዎን ይፍጠሩ።',
};

const translations: Record<Locale, Translations> = { en, am };

/**
 * Get a translated string by key.
 */
export function t(key: string, locale: Locale = 'en'): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}

/**
 * Get the translated status label.
 */
export function tStatus(status: string, locale: Locale = 'en'): string {
  return t(`status.${status}`, locale);
}

/**
 * Get display name of a locale.
 */
export function getLocaleName(locale: Locale): string {
  return locale === 'am' ? 'አማርኛ' : 'English';
}

/**
 * Get flag emoji for a locale.
 */
export function getLocaleFlag(locale: Locale): string {
  return locale === 'am' ? '🇪🇹' : '🇬🇧';
}
