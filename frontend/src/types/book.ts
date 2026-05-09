export type BookStatus = 'interested' | 'reading' | 'completed';

export type Tag = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  title: string;
  author: string | null;
  thumbnail_url: string | null;
  status: BookStatus;
  memo: string | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
};

export type CreateBookInput = {
  title: string;
  author?: string;
  thumbnail_url?: string;
  status: BookStatus;
  memo?: string;
  tag_ids?: number[];
};
