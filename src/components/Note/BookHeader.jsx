import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../Common/StatusBadge'
import StarRating from '../Common/StarRating'
import { toInputDate, formatDate } from '../../utils/dateFormat'
import { openYes24WithAffiliate } from '../../utils/yes24'

export default function BookHeader({ book, onUpdate }) {
  const navigate = useNavigate()
  const [localBook, setLocalBook] = useState(book)

  const handleChange = (field, value) => {
    const updates = { [field]: value }
    if (field === 'status' && value === 'done' && !localBook.end_date) {
      updates.end_date = new Date().toISOString().slice(0, 10)
    }
    setLocalBook(prev => ({ ...prev, ...updates }))
    onUpdate?.(updates)
  }

  return (
    <div className="bg-white border-b border-cream-200 px-4 sm:px-6 py-5">
      <div className="max-w-4xl mx-auto flex gap-5">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/library')}
          className="self-start mt-1 text-brown-400 hover:text-brown-600 transition flex-shrink-0"
          title="서재로 돌아가기"
        >
          ← 서재
        </button>

        {/* 표지 */}
        <div className="flex-shrink-0 w-20 sm:w-28">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-cream-200 shadow-book">
            {localBook.cover_url ? (
              <img
                src={localBook.cover_url}
                alt={localBook.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                📖
              </div>
            )}
          </div>
        </div>

        {/* 책 정보 */}
        <div className="flex-1 min-w-0 space-y-2">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold text-brown-700 leading-tight">
            {localBook.title}
          </h1>
          <p className="text-sm text-brown-500 font-noto">
            {localBook.author}
            {localBook.publisher && (
              <span className="text-brown-300"> · {localBook.publisher}</span>
            )}
          </p>

          {/* 상태 & 별점 */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <StatusBadge
              status={localBook.status}
              onChange={(val) => handleChange('status', val)}
              editable
            />
            <StarRating
              value={localBook.rating || 0}
              onChange={(val) => handleChange('rating', val)}
            />
          </div>

          {/* Yes24 링크 */}
          <button
            onClick={() => openYes24WithAffiliate(localBook)}
            className="inline-flex items-center gap-1.5 text-xs font-noto px-3 py-1 rounded-full transition-all hover:opacity-80 cursor-pointer"
            style={{
              background: 'rgba(220,50,50,0.08)',
              border: '1px solid rgba(220,50,50,0.2)',
              color: 'rgba(200,80,80,0.8)',
              width: 'fit-content',
            }}
          >
            🔗 Yes24 상세정보
          </button>

          {/* 날짜 */}
          <div className="flex flex-wrap gap-4 text-xs text-brown-500 font-noto pt-1">
            <label className="flex items-center gap-1.5">
              <span>시작일</span>
              <input
                type="date"
                value={toInputDate(localBook.start_date)}
                onChange={(e) => handleChange('start_date', e.target.value || null)}
                className="border border-brown-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 bg-cream-50"
              />
            </label>
            <label className="flex items-center gap-1.5">
              <span>완독일</span>
              <input
                type="date"
                value={toInputDate(localBook.end_date)}
                onChange={(e) => handleChange('end_date', e.target.value || null)}
                className="border border-brown-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 bg-cream-50"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
