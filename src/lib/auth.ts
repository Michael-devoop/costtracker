// Auth utilities — placeholder for Phase 2
// Will implement JWT + bcrypt + NextAuth

export const DEMO_USER = {
  id: 'user-001',
  name: 'Michael Abebe',
  email: 'michael@costtracker.com',
  role: 'admin' as const,
};

export function getCurrentUser() {
  // MVP: always return the demo user
  return DEMO_USER;
}
