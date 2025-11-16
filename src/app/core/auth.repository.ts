// =====================================================
// AUTH REPOSITORY (LocalStorage + Hash + CRUD Usuarios)
// =====================================================

export interface User {
  email: string;
  nombreUsuario: string;
  nombreCompleto: string;
  fechaNacimiento?: string;
  direccion?: string;
  passwordHash: string;
  role: Role;
  status: 'active' | 'inactive';
}

export type Role = 'admin' | 'cliente';

export const ROLES = {
  ADMIN: 'admin' as Role,
  CLIENTE: 'cliente' as Role,
};

// Helpers de LocalStorage
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

// CRUD Usuarios
export function getUsers(): User[] {
  return read<User[]>('users', []);
}

export function saveUsers(lista: User[]) {
  write('users', lista);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function findUserByUsername(username: string): User | undefined {
  return getUsers().find((u) => u.nombreUsuario === username);
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(user: User) {
  const users = getUsers();
  const index = users.findIndex((u) => u.email === user.email);
  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }
}

// Sesión
export function getCurrentUser(): User | null {
  return read<User | null>('currentUser', null);
}

export function setCurrentUser(user: User | null) {
  write('currentUser', user);
}

// Reset Codes
export function setResetCode(email: string, code: string) {
  const codes = read<Record<string, string>>('resetCodes', {});
  codes[email] = code;
  write('resetCodes', codes);
}

export function getResetCode(email: string) {
  const codes = read<Record<string, string>>('resetCodes', {});
  return codes[email] || null;
}

export function clearResetCode(email: string) {
  const codes = read<Record<string, string>>('resetCodes', {});
  delete codes[email];
  write('resetCodes', codes);
}

// SHA256
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Semilla del administrador
export async function ensureAdminSeed() {
  const exist = findUserByEmail('admin@local.com');
  if (exist) return;

  const passwordHash = await sha256('Admin123!');

  const admin: User = {
    email: 'admin@local.com',
    nombreUsuario: 'admin',
    nombreCompleto: 'Administrador',
    passwordHash,
    role: ROLES.ADMIN,
    status: 'active',
  };

  addUser(admin);
}
