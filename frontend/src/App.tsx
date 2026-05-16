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
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
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
    setSearchHasMore(false);
    setView('search');
    try {
      const { books, has_more } = await searchGoogleBooks(query, 0);
      setSearchResults(books);
      setSearchHasMore(has_more);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadMoreLoading(true);
    try {
      const { books, has_more } = await searchGoogleBooks(searchQuery, searchResults.length);
      setSearchResults((prev) => [...prev, ...books]);
      setSearchHasMore(has_more);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const handleSearchClear = () => {
    setSearchResults([]);
    setSearchQuery('');
    setSearchHasMore(false);
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
      series_name: book.series_name ?? undefined,
      status: 'interested',
    });
    await loadBooks();
  };

  const savedGoogleIds = new Set(books.map((b) => b.google_books_id).filter(Boolean) as string[]);

  return (
    <div className="min-h-screen bg-brown-50">
      {view !== 'detail' && <Header view={view} onChangeView={handleChangeView} />}

      {view === 'search' && (
        <div className="sticky top-[100px] z-10 bg-brown-50 border-b border-gray-200">
          <div className="max-w-sm mx-auto">
            <SearchBar onSearch={handleSearch} onClear={handleSearchClear} />
          </div>
        </div>
      )}

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
                {searchHasMore && (
                  <div className="px-4 py-4 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadMoreLoading}
                      className="w-full py-2.5 rounded-lg border border-brown-300 text-sm text-brown-600 hover:bg-brown-100 disabled:opacity-50 transition-colors"
                    >
                      {loadMoreLoading ? '読み込み中...' : 'もっと見る'}
                    </button>
                  </div>
                )}
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
