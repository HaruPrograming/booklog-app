import { useEffect, useState } from 'react';
import type { Book } from './types/book';
import { fetchBooks } from './api/books';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { Header } from './components/Header';

type View = 'list' | 'form';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [view, setView] = useState<View>('list');
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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

  const handleSaved = async () => {
    await loadBooks();
    setView('list');
    setEditingBook(null);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setView('form');
  };

  const handleChangeView = (v: View) => {
    setView(v);
    if (v === 'list') setEditingBook(null);
  };

  return (
    <div className="min-h-screen bg-brown-50">
      <Header view={view} onChangeView={handleChangeView} />

      <main className="max-w-sm mx-auto">
        {view === 'form' ? (
          <BookForm
            key={editingBook?.id ?? 'new'}
            editingBook={editingBook}
            onSaved={handleSaved}
          />
        ) : loading ? (
          <p className="text-center text-brown-400 py-12">読み込み中...</p>
        ) : (
          <BookList books={books} onUpdated={loadBooks} onEdit={handleEdit} />
        )}
      </main>
    </div>
  );
}

export default App;
