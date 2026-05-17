import { useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
  onClear: () => void;
  onBarcodeClick?: () => void;
};

export function SearchBar({ onSearch, onClear, onBarcodeClick }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="タイトル・著者名で検索"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-brown-400"
      />
      <button
        type="submit"
        disabled={!query.trim()}
        className="px-4 py-2 bg-brown-600 text-white rounded-lg text-sm disabled:opacity-40"
      >
        検索
      </button>
      {query.trim() ? (
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-2 text-gray-500 rounded-lg text-sm border border-gray-300"
        >
          ✕
        </button>
      ) : (
        <button
          type="button"
          onClick={onBarcodeClick}
          className="px-3 py-2 text-gray-500 rounded-lg text-sm border border-gray-300"
        >
          📷
        </button>
      )}
    </form>
  );
}
