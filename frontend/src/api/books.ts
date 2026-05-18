import type { Book, CreateBookInput } from '../types/book';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${API_BASE}/books`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function createBook(input: CreateBookInput): Promise<Book> {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return res.json();
}

export async function updateBook(id: number, input: Partial<CreateBookInput>): Promise<Book> {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update book');
  return res.json();
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete book');
}
