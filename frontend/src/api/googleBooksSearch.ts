import type { GoogleBookDetail, GoogleBookResult } from '../types/book';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

export async function searchGoogleBooks(
  query: string,
  startIndex = 0
): Promise<{ books: GoogleBookResult[]; has_more: boolean }> {
  const res = await fetch(
    `${BASE_URL}/books/keyword-search?q=${encodeURIComponent(query)}&start_index=${startIndex}`
  );
  if (!res.ok) throw new Error('検索に失敗しました');
  return res.json();
}

export async function fetchGoogleBookDetail(id: string): Promise<GoogleBookDetail> {
  const res = await fetch(`${BASE_URL}/google-books/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('詳細の取得に失敗しました');
  const data = await res.json();
  return data.book;
}
