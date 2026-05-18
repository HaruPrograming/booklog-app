import { useState } from 'react';
import type { Book, BookStatus } from '../types/book';
import { deleteBook } from '../api/books';

const STATUS_LABEL: Record<BookStatus, string> = {
  interested: '気になる',
  reading: '読書中',
  completed: '読了',
};

const STATUS_COLOR: Record<BookStatus, string> = {
  interested: 'bg-amber-100 text-amber-800',
  reading: 'bg-brown-200 text-brown-800',
  completed: 'bg-green-100 text-green-800',
};

type Props = {
  books: Book[];
  onUpdated: () => void;
  onEdit: (book: Book) => void;
};

export function BookList({ books, onUpdated, onEdit }: Props) {
  const [confirmDeleteBook, setConfirmDeleteBook] = useState<Book | null>(null);

  const handleDelete = async () => {
    if (!confirmDeleteBook) return;
    await deleteBook(confirmDeleteBook.id);
    setConfirmDeleteBook(null);
    onUpdated();
  };

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">📖</span>
        <p className="text-brown-400 text-sm">まだ本が登録されていません</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 p-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl p-3 flex flex-col gap-2 shadow-sm border border-brown-100"
          >
            <div className="w-full h-32 rounded-xl overflow-hidden bg-brown-50">
              {book.thumbnail_url ? (
                <img
                  src={book.thumbnail_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-brown-200">
                  <span className="text-3xl">📚</span>
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[book.status]}`}>
                {STATUS_LABEL[book.status]}
              </span>
            </div>

            <div className="flex-1">
              <p className="font-semibold text-brown-900 text-sm leading-snug line-clamp-3">
                {book.title}
              </p>
              {book.author && (
                <p className="text-xs text-brown-400 mt-1 line-clamp-1">{book.author}</p>
              )}
              <p className="text-xs text-brown-500 mt-0.5 line-clamp-1">
                {book.series_name && <span>{book.series_name}　</span>}
                所持: {book.volume_number ?? 0}巻
              </p>
            </div>

            {book.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-brown-100 text-brown-600 px-2 py-0.5 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-1.5 mt-auto pt-1">
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="flex-1 text-xs text-brown-600 border border-brown-200 rounded-lg py-1.5 active:bg-brown-50"
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteBook(book)}
                className="flex-1 text-xs text-red-400 border border-red-100 rounded-lg py-1.5 active:bg-red-50"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDeleteBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-center">
              <p className="text-base font-semibold text-brown-900">{confirmDeleteBook.title}</p>
              {confirmDeleteBook.author && (
                <p className="text-sm text-brown-400">{confirmDeleteBook.author}</p>
              )}
              <p className="text-sm text-brown-600 mt-1">を削除しますか？</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteBook(null)}
                className="flex-1 py-3 rounded-xl border border-brown-200 text-brown-700 text-sm font-medium"
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
    </>
  );
}
