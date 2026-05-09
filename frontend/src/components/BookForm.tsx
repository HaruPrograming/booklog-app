import { useState } from 'react';
import type { BookStatus, CreateBookInput } from '../types/book';
import { createBook } from '../api/books';

type Props = {
  onCreated: () => void;
};

export function BookForm({ onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('interested');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const input: CreateBookInput = {
        title: title.trim(),
        author: author.trim() || undefined,
        status,
      };
      await createBook(input);
      setTitle('');
      setAuthor('');
      setStatus('interested');
      onCreated();
    } catch {
      setError('登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">タイトル *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="本のタイトル"
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">著者</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="著者名"
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">ステータス</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookStatus)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="interested">気になる</option>
          <option value="reading">読書中</option>
          <option value="completed">読了</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-4 text-base font-medium disabled:opacity-50 active:bg-blue-700"
      >
        {loading ? '保存中...' : '登録する'}
      </button>
    </form>
  );
}
