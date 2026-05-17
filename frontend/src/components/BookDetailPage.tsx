import { useEffect, useState } from 'react';
import type { GoogleBookDetail, GoogleBookResult } from '../types/book';
import { fetchGoogleBookDetail } from '../api/googleBooksSearch';

type Props = {
  book: GoogleBookResult;
  isSaved: boolean;
  onSave: (book: GoogleBookResult) => void;
  onBack: () => void;
};

export function BookDetailPage({ book, isSaved, onSave, onBack }: Props) {
  const [detail, setDetail] = useState<GoogleBookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoogleBookDetail(book.google_books_id)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [book.google_books_id]);

  const displayData = detail ?? book;

  return (
    <div className="min-h-screen bg-brown-50">
      <div className="sticky top-0 bg-brown-700 border-b border-brown-600 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-brown-200 hover:text-white">
          ← 戻る
        </button>
        <span className="text-sm font-medium text-white line-clamp-1">{displayData.title}</span>
      </div>

      <div className="max-w-sm mx-auto p-4 space-y-4">
        <div className="flex gap-4">
          <div className="w-24 h-36 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
            {displayData.thumbnail_url ? (
              <img
                src={displayData.thumbnail_url}
                alt={displayData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <h1 className="text-base font-bold text-gray-800 leading-tight">{displayData.title}</h1>
            <p className="text-sm text-gray-500">{displayData.author ?? '著者不明'}</p>
            {displayData.published_date && (
              <p className="text-xs text-gray-400">
                {displayData.published_date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年$2月$3日').replace(/^(\d{4})-(\d{2})$/, '$1年$2月').replace(/^(\d{4})$/, '$1年')}
              </p>
            )}
            {displayData.series_name && (
              <p className="text-xs text-gray-500">
                {displayData.series_name}
                {detail?.series_volume_count != null && detail.series_volume_count > 0 && (
                  <span>　全{detail.series_volume_count}巻</span>
                )}
              </p>
            )}
            {detail?.latest_published_date && (
              <p className="text-xs text-gray-400">最新刊発行日: {detail.latest_published_date}</p>
            )}
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-400 text-sm py-4">読み込み中...</p>
        )}

        {detail && (
          <>
            {(detail.average_rating !== null || detail.ratings_count !== null) && (
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">みんなの評価</p>
                <div className="flex items-center gap-2">
                  {detail.average_rating !== null && (
                    <span className="text-lg font-bold text-amber-500">
                      {'★'.repeat(Math.round(detail.average_rating))}
                      {'☆'.repeat(5 - Math.round(detail.average_rating))}
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    {detail.average_rating?.toFixed(1) ?? '-'} / 5
                  </span>
                  {detail.ratings_count !== null && (
                    <span className="text-xs text-gray-400">({detail.ratings_count}件)</span>
                  )}
                </div>
              </div>
            )}

            {detail.series_name && (
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">シリーズ情報</p>
                <p className="text-sm text-gray-700">{detail.series_name}</p>
                <div className="flex gap-4 mt-1">
                  {detail.volume_number !== null && (
                    <p className="text-xs text-gray-500">この巻: 第{detail.volume_number}巻</p>
                  )}
                  {detail.series_volume_count !== null && detail.series_volume_count > 0 && (
                    <p className="text-xs text-gray-500">既刊: 全{detail.series_volume_count}巻</p>
                  )}
                </div>
              </div>
            )}

            {detail.description && (
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">あらすじ</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {detail.description}
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => !isSaved && onSave(book)}
          disabled={isSaved}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
            isSaved
              ? 'bg-green-50 border border-green-400 text-green-600'
              : 'bg-brown-600 text-white hover:bg-brown-700'
          }`}
        >
          {isSaved ? '✓ 気になるリストに登録済み' : '☆ 気になるリストに追加'}
        </button>
      </div>
    </div>
  );
}
