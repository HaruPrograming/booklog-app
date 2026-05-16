import type { GoogleBookResult } from '../types/book';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  const res = await fetch(`${BASE_URL}/books/keyword-search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('検索に失敗しました');
  const data = await res.json();
  return data.books;
}
