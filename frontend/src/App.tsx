import { useEffect, useState } from 'react';
import type { Book } from './types/book';
import { fetchBooks } from './api/books';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';

type View = 'list' | 'form';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [view, setView] = useState<View>('list');
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleCreated = async () => {
    await loadBooks();
    setView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">読書記録</h1>
        {view === 'list' ? (
          <button
            onClick={() => setView('form')}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg active:bg-blue-700"
          >
            + 登録
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            className="text-gray-500 text-sm px-4 py-2"
          >
            キャンセル
          </button>
        )}
      </header>

      <main>
        {view === 'form' ? (
          <BookForm onCreated={handleCreated} />
        ) : loading ? (
          <p className="text-center text-gray-400 py-12">読み込み中...</p>
        ) : (
          <BookList books={books} onUpdated={loadBooks} />
        )}
      </main>
    </div>
  );
}

export default App;
