import type { GoogleBookResult } from '../types/book';

type Props = {
  book: GoogleBookResult;
  isSaved: boolean;
  onSave: (book: GoogleBookResult) => void;
  onDetail: (book: GoogleBookResult) => void;
};

export function SearchResultCard({ book, isSaved, onSave, onDetail }: Props) {
  return (
    <div className="flex gap-3 p-3 border-b border-gray-100 cursor-pointer" onClick={() => onDetail(book)}>
      <div className="w-14 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {book.thumbnail_url ? (
          <img
            src={book.thumbnail_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">{book.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{book.author ?? '著者不明'}</p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); if (!isSaved) onSave(book); }}
        disabled={isSaved}
        className={`self-center flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
          isSaved
            ? 'border-green-400 text-green-600 bg-green-50'
            : 'border-gray-300 text-gray-600 hover:border-brown-400 hover:text-brown-600'
        }`}
      >
        {isSaved ? '✓ 保存済み' : '☆ 気になる'}
      </button>
    </div>
  );
}
