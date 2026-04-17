import { useState } from 'react'
import { Link } from 'react-router-dom'
import EditBookModal from './EditBookModal'

const STATUS_DOT = {
  want: { color: '#60A5FA', label: '읽고 싶어요' },
  reading: { color: '#F59E0B', label: '읽는 중' },
  done: { color: '#34D399', label: '완독' },
}

// 알라딘 이미지 최대 해상도 시도 (cover500 → 원본 순으로 fallback)
function getHighResCover(url) {
  if (!url) return url
  // coversum(썸네일) → cover(표준) 업그레이드
  const standard = url.replace(/\/coversum\//gi, '/cover/').replace(/coversum\./gi, 'cover.')
  // cover → cover500(500px) 시도
  return standard.replace(/\/cover\//gi, '/cover500/').replace(/\/cover([^5])/gi, '/cover500$1')
}

export default function BookCard({ book, onUpdate, onDelete }) {
  const [cover, setCover] = useState(() => getHighResCover(book.cover_url))
  const originalCover = book.cover_url
  const [showEdit, setShowEdit] = useState(false)
  const status = STATUS_DOT[book.status] || STATUS_DOT.want

  return (
    <>
    <Link to={`/book/${book.id}`} className="group block relative select-none">
      {/* 책 컨테이너 */}
      <div
        className="relative transition-all duration-300 ease-out group-hover:-translate-y-4 group-hover:scale-105"
        style={{ transformOrigin: 'bottom center' }}
      >
        {/* 책 표지 */}
        <div
          className="relative w-full overflow-hidden rounded-r-sm"
          style={{
            aspectRatio: '2 / 3',
            boxShadow: '-5px 5px 15px rgba(0,0,0,0.7), -2px 2px 4px rgba(0,0,0,0.5), inset -3px 0 6px rgba(0,0,0,0.3)',
          }}
        >
          {/* 책 등(spine) 효과 */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: '8px',
              background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.1), transparent)',
            }}
          />

          {/* 표지 이미지 */}
          {cover ? (
            <img
              src={cover}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => {
                // cover500 실패 → 원본 URL로 fallback
                if (cover !== originalCover) {
                  setCover(originalCover)
                } else {
                  setCover(null)
                }
              }}
            />
          ) : null}

          {/* 표지 없을 때 */}
          <div
            className={`w-full h-full items-center justify-center p-2 ${cover ? 'hidden' : 'flex'}`}
            style={{ background: 'linear-gradient(135deg, #5C3A1E 0%, #3D2B1F 100%)' }}
          >
            <span className="text-center font-noto text-white/70 text-xs leading-tight line-clamp-4">
              {book.title}
            </span>
          </div>

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 z-20">
            <p className="text-white text-xs font-noto font-bold line-clamp-3 leading-snug mb-1">
              {book.title}
            </p>
            <p className="text-white/60 text-xs font-noto truncate">
              {book.author}
            </p>
            {book.rating > 0 && (
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`text-xs ${i <= book.rating ? 'text-amber-400' : 'text-white/20'}`}>★</span>
                ))}
              </div>
            )}
          </div>

          {/* 광택 효과 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-0 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* 책 아랫면 그림자 */}
        <div
          className="absolute -bottom-1 left-1 right-1 h-2 rounded-full opacity-60 blur-sm"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        />
      </div>

      {/* 상태 표시 점 + 수정 버튼 */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full opacity-70"
          style={{ backgroundColor: status.color }} title={status.label} />
        <button
          onClick={e => { e.preventDefault(); setShowEdit(true) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded"
          style={{ color: 'rgba(200,160,80,0.7)', background: 'rgba(255,255,255,0.08)' }}
          title="수정"
        >✏️</button>
      </div>
    </Link>

    {showEdit && (
      <EditBookModal
        book={book}
        onSave={async (updates) => { await onUpdate?.(book.id, updates) }}
        onDelete={async () => { await onDelete?.(book.id) }}
        onClose={() => setShowEdit(false)}
      />
    )}
  </>
  )
}
