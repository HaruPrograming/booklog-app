import { useState, useEffect } from 'react';
import type { Book, BookStatus, CreateBookInput, Tag } from '../types/book';
import { createBook, updateBook } from '../api/books';
import { fetchTags, createTag } from '../api/tags';

type Props = {
  editingBook?: Book | null;
  onSaved: () => void;
};

export function BookForm({ editingBook, onSaved }: Props) {
  const [title, setTitle] = useState(editingBook?.title ?? '');
  const [author, setAuthor] = useState(editingBook?.author ?? '');
  const [status, setStatus] = useState<BookStatus>(editingBook?.status ?? 'interested');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    editingBook?.tags.map((t) => t.id) ?? []
  );
  const [newTagName, setNewTagName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = editingBook != null;

  useEffect(() => {
    fetchTags().then(setTags).catch(() => {});
  }, []);

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleAddTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    try {
      const tag = await createTag(name);
      setTags((prev) => [...prev, tag]);
      setSelectedTagIds((prev) => [...prev, tag.id]);
      setNewTagName('');
    } catch {
      setError('タグの作成に失敗しました。');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await updateBook(editingBook.id, {
          title: title.trim(),
          author: author.trim() || undefined,
          status,
          tag_ids: selectedTagIds,
        });
      } else {
        const input: CreateBookInput = {
          title: title.trim(),
          author: author.trim() || undefined,
          status,
          tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        };
        await createBook(input);
      }
      onSaved();
    } catch {
      setError(isEditing ? '更新に失敗しました。' : '登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      {isEditing && (
        <p className="text-xs text-brown-400 text-center">編集中: {editingBook.title}</p>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-brown-700">タイトル *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="本のタイトル"
          className="border border-brown-200 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-brown-400"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-brown-700">著者</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="著者名"
          className="border border-brown-200 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-brown-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-brown-700">ステータス</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookStatus)}
          className="border border-brown-200 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-brown-400"
        >
          <option value="interested">気になる</option>
          <option value="reading">読書中</option>
          <option value="completed">読了</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-brown-700">タグ</label>
        {selectedTagIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.filter((tag) => selectedTagIds.includes(tag.id)).map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-brown-600 text-white"
              >
                {tag.name}
                <span className="text-xs leading-none opacity-70">×</span>
              </button>
            ))}
          </div>
        )}
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => { setNewTagName(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)}
              placeholder="新しいタグを追加"
              className="w-full border border-brown-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brown-400"
            />
            {showSuggestions && (() => {
              const q = newTagName.trim().toLowerCase();
              const suggestions = tags.filter(
                (t) => !selectedTagIds.includes(t.id) && t.name.toLowerCase().includes(q) && q !== ''
              );
              return suggestions.length > 0 ? (
                <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-brown-100 rounded-xl shadow-md max-h-40 overflow-y-auto">
                  {suggestions.map((t) => (
                    <li
                      key={t.id}
                      onMouseDown={(e) => { e.preventDefault(); toggleTag(t.id); setNewTagName(''); setShowSuggestions(false); }}
                      className="px-3 py-2 text-sm text-brown-700 cursor-pointer hover:bg-brown-50"
                    >
                      {t.name}
                    </li>
                  ))}
                </ul>
              ) : null;
            })()}
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!newTagName.trim()}
            className="px-3 py-2 bg-brown-100 text-brown-700 rounded-xl text-sm font-medium disabled:opacity-40 active:bg-brown-200"
          >
            追加
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="mt-2 bg-brown-600 text-white rounded-xl px-4 py-4 text-base font-semibold disabled:opacity-50 active:bg-brown-700"
      >
        {loading ? '保存中...' : isEditing ? '変更する' : '登録する'}
      </button>
    </form>
  );
}
