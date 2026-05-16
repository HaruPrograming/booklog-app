export type BookStatus = 'interested' | 'reading' | 'completed';

export type Tag = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  google_books_id: string | null;
  title: string;
  author: string | null;
  isbn: string | null;
  thumbnail_url: string | null;
  description: string | null;
  status: BookStatus;
  memo: string | null;
  series_name: string | null;
  volume_number: number | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
};

export type GoogleBookResult = {
  google_books_id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  thumbnail_url: string | null;
  description: string | null;
  series_name: string | null;
  volume_number: number | null;
  published_date: string | null;
};

export type GoogleBookDetail = GoogleBookResult & {
  average_rating: number | null;
  ratings_count: number | null;
  series_volume_count: number | null;
  latest_published_date: string | null;
};

export type CreateBookInput = {
  google_books_id?: string;
  title: string;
  author?: string;
  isbn?: string;
  thumbnail_url?: string;
  description?: string;
  status: BookStatus;
  memo?: string;
  series_name?: string;
  volume_number?: number;
  tag_ids?: number[];
};
