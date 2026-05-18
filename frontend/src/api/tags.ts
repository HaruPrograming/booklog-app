import type { Tag } from '../types/book';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/tags`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function createTag(name: string): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create tag');
  return res.json();
}
