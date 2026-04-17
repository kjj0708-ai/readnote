import { useState } from 'react'
import BookCard from './BookCard'
import StatusFilter from './StatusFilter'

const SHELF_SIZE = 8 // 선반 하나당 책 수 (데스크톱 기준)

export default function BookGrid({ books, loading, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? books : books.filter(b => b.status === filter)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-8 w-20 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        {[1, 2].map(row => (
          <div key={row}>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 px-4 pb-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
              ))}
            </div>
            <div className="h-5 rounded-sm mx-2" style={{ background: 'linear-gradient(to bottom, #8B5E3C, #4A2A10)' }} />
          </div>
        ))}
      </div>
    )
  }

  // 책을 선반 크기로 그룹화
  const rows = []
  for (let i = 0; i < filtered.length; i += SHELF_SIZE) {
    rows.push(filtered.slice(i, i + SHELF_SIZE))
  }

  return (
    <div className="space-y-2">
      {/* 필터 */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <StatusFilter active={filter} onChange={setFilter} />
        <span className="text-sm font-noto" style={{ color: 'rgba(255,220,170,0.5)' }}>
          {filtered.length}권
        </span>
      </div>

      {/* 책이 없을 때 */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4 opacity-30">📚</div>
          <p className="font-noto text-sm font-medium mb-1" style={{ color: 'rgba(255,220,170,0.5)' }}>
            {filter === 'all' ? '아직 추가된 도서가 없습니다' : '해당 상태의 도서가 없습니다'}
          </p>
          <p className="font-noto text-xs" style={{ color: 'rgba(255,200,120,0.3)' }}>
            {filter === 'all' ? '"도서 추가" 버튼으로 책을 검색해 추가해보세요' : '다른 필터를 선택해보세요'}
          </p>
        </div>
      )}

      {/* 선반별 책 진열 */}
      {rows.map((rowBooks, rowIdx) => (
        <div key={rowIdx} className="relative">
          {/* 책들 */}
          <div
            className="grid gap-3 px-6 pt-6 pb-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}
          >
            {rowBooks.map(book => (
              <BookCard key={book.id} book={book} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>

          {/* 나무 선반 판자 */}
          <div className="mx-2 relative" style={{ height: '18px' }}>
            {/* 선반 상단 하이라이트 */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(to right, transparent, #D4956A 20%, #C4815A 80%, transparent)' }}
            />
            {/* 선반 몸통 */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, #A0673A 0%, #7A4A24 40%, #5C3318 100%)',
                borderRadius: '2px',
              }}
            />
            {/* 선반 하단 그림자 */}
            <div
              className="absolute -bottom-3 left-0 right-0 h-3 blur-sm"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}
            />
            {/* 나무결 효과 */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.15) 61px)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
