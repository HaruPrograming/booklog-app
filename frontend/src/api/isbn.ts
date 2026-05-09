const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api';

export type IsbnSearchResult = {
  title: string;
  author: string | null;
  thumbnail_url: string | null;
  description: string | null;
};

export async function searchByIsbn(isbn: string): Promise<IsbnSearchResult | null> {
  const res = await fetch(`${API_BASE}/books/isbn-search?isbn=${encodeURIComponent(isbn)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('ISBN検索に失敗しました');
  return res.json();
}
