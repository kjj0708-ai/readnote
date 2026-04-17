export default function SearchResult({ book, onSelect, loading }) {
  return (
    <button
      onClick={() => !loading && onSelect(book)}
      disabled={loading}
      className="w-full flex gap-3 p-3 hover:bg-cream-100 rounded-lg transition text-left group disabled:opacity-50"
    >
      {/* 표지 */}
      <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-brown-100">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            📖
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="font-noto font-semibold text-brown-700 text-sm leading-snug line-clamp-2 group-hover:text-brown-900">
          {book.title}
        </p>
        <p className="text-xs text-brown-400 font-noto mt-0.5 truncate">
          {book.author}
        </p>
        {book.publisher && (
          <p className="text-xs text-brown-300 font-noto truncate">
            {book.publisher}
          </p>
        )}
        {book.pubDate && (
          <p className="text-xs text-brown-300 font-noto">
            {book.pubDate?.slice(0, 4)}년
          </p>
        )}
      </div>

      {/* 추가 화살표 */}
      <div className="flex-shrink-0 self-center text-brown-300 group-hover:text-amber-500 transition">
        +
      </div>
    </button>
  )
}
