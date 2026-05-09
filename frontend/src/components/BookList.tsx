import type { Book, BookStatus } from '../types/book';

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
};

export function BookList({ books }: Props) {
  if (books.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        まだ本が登録されていません
      </p>
    );
  }

  return (
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
        </li>
      ))}
    </ul>
  );
}
