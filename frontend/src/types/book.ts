export type BookStatus = 'interested' | 'reading' | 'completed';

export type Book = {
  id: number;
  title: string;
  author: string | null;
  isbn: string | null;
  thumbnail_url: string | null;
  description: string | null;
  status: BookStatus;
  created_at: string;
  updated_at: string;
};

export type CreateBookInput = {
  title: string;
  author?: string;
  status: BookStatus;
};
