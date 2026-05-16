import { useEffect, useState } from 'react';
import type { Book, GoogleBookResult } from './types/book';
import { fetchBooks, createBook } from './api/books';
import { searchGoogleBooks } from './api/googleBooksSearch';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { BookDetailPage } from './components/BookDetailPage';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SearchResultCard } from './components/SearchResultCard';

type View = 'list' | 'form' | 'search' | 'detail';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [view, setView] = useState<View>('list');
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchResults, setSearchResults] = useState<GoogleBookResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<GoogleBookResult | null>(null);

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearchLoading(true);
    setView('search');
    try {
      const results = await searchGoogleBooks(query);
      setSearchResults(results);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchClear = () => {
    setSearchResults([]);
    setSearchQuery('');
    setView('list');
  };

  const handleOpenDetail = (book: GoogleBookResult) => {
    setSelectedBook(book);
    setView('detail');
  };

  const handleBackFromDetail = () => {
    setView('search');
  };

  const handleSaveFromSearch = async (book: GoogleBookResult) => {
    await createBook({
      google_books_id: book.google_books_id,
      title: book.title,
      author: book.author ?? undefined,
      thumbnail_url: book.thumbnail_url ?? undefined,
      isbn: book.isbn ?? undefined,
      description: book.description ?? undefined,
      status: 'interested',
    });
    await loadBooks();
  };

  const savedGoogleIds = new Set(books.map((b) => b.google_books_id).filter(Boolean) as string[]);

  return (
    <div className="min-h-screen bg-brown-50">
      {view !== 'detail' && <Header view={view} onChangeView={handleChangeView} />}

      {view === 'detail' && selectedBook && (
        <BookDetailPage
          book={selectedBook}
          isSaved={savedGoogleIds.has(selectedBook.google_books_id)}
          onSave={handleSaveFromSearch}
          onBack={handleBackFromDetail}
        />
      )}

      <main className="max-w-sm mx-auto">
        {view === 'detail' ? null : view === 'form' ? (
          <BookForm
            key={editingBook?.id ?? 'new'}
            editingBook={editingBook}
            onSaved={handleSaved}
          />
        ) : view === 'search' ? (
          <>
            <SearchBar onSearch={handleSearch} onClear={handleSearchClear} />
            {searchLoading ? (
              <p className="text-center text-gray-400 py-12">検索中...</p>
            ) : (
              <>
                <p className="text-xs text-gray-500 px-4 pb-2">
                  「{searchQuery}」の検索結果 {searchResults.length}件
                </p>
                {searchResults.map((book) => (
                  <SearchResultCard
                    key={book.google_books_id}
                    book={book}
                    isSaved={savedGoogleIds.has(book.google_books_id)}
                    onSave={handleSaveFromSearch}
                    onDetail={handleOpenDetail}
                  />
                ))}
              </>
            )}
          </>
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
