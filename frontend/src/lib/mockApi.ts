// Simple localStorage-backed mock API for frontend development
// This keeps state between reloads and mimics async API calls.
type User = { id: string; name: string; email: string };
type Group = { id: string; name: string; adminId: string; members: string[] };
type Contribution = {
  id: string;
  groupId: string;
  memberId: string;
  amount: number;
  date: string;
};

const STORAGE_KEY = "chamasmart:db";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const defaultDb = {
    users: [
      { id: "u_admin", name: "Admin User", email: "admin@example.com" },
      { id: "u_alice", name: "Alice", email: "alice@example.com" },
    ],
    groups: [
      {
        id: "g_demo",
        name: "Demo Chama",
        adminId: "u_admin",
        members: ["u_admin", "u_alice"],
      },
    ],
    contributions: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
  return defaultDb;
}

function save(db: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export async function api_getCurrentUser(): Promise<User | null> {
  const raw = sessionStorage.getItem("chamasmart:currentUser");
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function api_login(email: string): Promise<User> {
  const db = load();
  let user = db.users.find((u: any) => u.email === email);
  if (!user) {
    user = { id: uid("u_"), name: email.split("@")[0], email };
    db.users.push(user);
    save(db);
  }
  sessionStorage.setItem("chamasmart:currentUser", JSON.stringify(user));
  return user;
}

export async function api_logout(): Promise<void> {
  sessionStorage.removeItem("chamasmart:currentUser");
}

export async function api_getGroupsForUser(userId: string): Promise<Group[]> {
  const db = load();
  return db.groups.filter((g: any) => g.members.includes(userId));
}

export async function api_createGroup(
  name: string,
  adminId: string
): Promise<Group> {
  const db = load();
  const group = { id: uid("g_"), name, adminId, members: [adminId] };
  db.groups.push(group);
  save(db);
  return group;
}

export async function api_getGroup(id: string): Promise<Group | null> {
  const db = load();
  return db.groups.find((g: any) => g.id === id) || null;
}

export async function api_addMember(
  groupId: string,
  userId: string
): Promise<void> {
  const db = load();
  const g = db.groups.find((g: any) => g.id === groupId);
  if (!g) throw new Error("group not found");
  if (!g.members.includes(userId)) g.members.push(userId);
  save(db);
}

export async function api_addContribution(
  groupId: string,
  memberId: string,
  amount: number
): Promise<Contribution> {
  const db = load();
  const c = {
    id: uid("c_"),
    groupId,
    memberId,
    amount,
    date: new Date().toISOString(),
  };
  db.contributions.push(c);
  save(db);
  return c;
}

export async function api_getContributions(
  groupId: string
): Promise<Contribution[]> {
  const db = load();
  return db.contributions.filter((c: any) => c.groupId === groupId);
}

export async function api_getUsersByIds(ids: string[]): Promise<User[]> {
  const db = load();
  return db.users.filter((u: any) => ids.includes(u.id));
}

// Expose helper to reset DB (dev only)
export function api_reset() {
  localStorage.removeItem(STORAGE_KEY);
}
