type View = 'list' | 'form' | 'search';

type Props = {
  view: View;
  onChangeView: (v: View) => void;
};

export function Header({ view, onChangeView }: Props) {
  return (
    <header className="bg-brown-700 sticky top-0 z-10">
      <div className="px-4 py-4">
        <h1 className="text-lg font-bold text-white tracking-wide">📚 読書記録</h1>
      </div>

      <div className="flex border-t border-brown-600">
        <button
          onClick={() => onChangeView('list')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            view === 'list'
              ? 'text-white border-b-2 border-brown-300'
              : 'text-brown-300 hover:text-brown-100'
          }`}
        >
          一覧
        </button>
        <button
          onClick={() => onChangeView('form')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            view === 'form'
              ? 'text-white border-b-2 border-brown-300'
              : 'text-brown-300 hover:text-brown-100'
          }`}
        >
          登録
        </button>
        <button
          onClick={() => onChangeView('search')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            view === 'search'
              ? 'text-white border-b-2 border-brown-300'
              : 'text-brown-300 hover:text-brown-100'
          }`}
        >
          検索
        </button>
      </div>
    </header>
  );
}
