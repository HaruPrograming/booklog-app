import { useState } from 'react';
import type { Book, BookStatus } from '../types/book';
import { deleteBook } from '../api/books';
import { BookEditModal } from './BookEditModal';

const STATUS_LABEL: Record<BookStatus, string> = {
  interested: '気になる',
  reading: '読書中',
  completed: '読了',
};

const STATUS_COLOR: Record<BookStatus, string> = {
  interested: 'bg-yellow-100 text-yellow-800',
  reading: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

type Props = {
  books: Book[];
  onUpdated: () => void;
};

export function BookList({ books, onUpdated }: Props) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    await deleteBook(confirmDeleteId);
    setConfirmDeleteId(null);
    onUpdated();
  };

  if (books.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        まだ本が登録されていません
      </p>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3 p-4">
        {books.map((book) => (
          <li
            key={book.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-gray-900 leading-snug">{book.title}</span>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLOR[book.status]}`}
              >
                {STATUS_LABEL[book.status]}
              </span>
            </div>
            {book.author && (
              <span className="text-sm text-gray-500">{book.author}</span>
            )}
            {book.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {book.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setEditingBook(book)}
                className="flex-1 text-sm text-blue-600 border border-blue-200 rounded-lg py-1.5 active:bg-blue-50"
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(book.id)}
                className="flex-1 text-sm text-red-500 border border-red-200 rounded-lg py-1.5 active:bg-red-50"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <p className="text-base font-medium text-gray-800">本当に削除しますか？</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium active:bg-red-600"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBook && (
        <BookEditModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onUpdated={() => { setEditingBook(null); onUpdated(); }}
        />
      )}
    </>
  );
}
