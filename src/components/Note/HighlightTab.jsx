import { useState } from 'react'
import EmptyState from '../Common/EmptyState'
import { formatDate } from '../../utils/dateFormat'

const COLORS = [
  { key: 'yellow', label: '노랑', bg: 'bg-yellow-100 border-yellow-300', dot: 'bg-yellow-400' },
  { key: 'green', label: '초록', bg: 'bg-green-100 border-green-300', dot: 'bg-green-400' },
  { key: 'blue', label: '파랑', bg: 'bg-blue-100 border-blue-300', dot: 'bg-blue-400' },
  { key: 'pink', label: '핑크', bg: 'bg-pink-100 border-pink-300', dot: 'bg-pink-400' },
]

function HighlightCard({ highlight, onDelete }) {
  const colorConfig = COLORS.find((c) => c.key === highlight.color) || COLORS[0]
  const [confirming, setConfirming] = useState(false)

  return (
    <div className={`relative border rounded-xl p-4 ${colorConfig.bg} group`}>
      <blockquote className="font-noto text-brown-700 text-sm leading-relaxed italic">
        "{highlight.content}"
      </blockquote>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colorConfig.dot}`} />
          {highlight.page_num && (
            <span className="text-xs text-brown-400 font-noto">{highlight.page_num}쪽</span>
          )}
          <span className="text-xs text-brown-300 font-noto">
            {formatDate(highlight.created_at)}
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition">
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(highlight.id)}
                className="text-xs text-red-500 hover:text-red-700 font-noto"
              >
                삭제
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs text-brown-400 hover:text-brown-600 font-noto"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs text-brown-300 hover:text-red-400 transition font-noto"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HighlightTab({ highlights, onAdd, onDelete, loading }) {
  const [content, setContent] = useState('')
  const [pageNum, setPageNum] = useState('')
  const [color, setColor] = useState('yellow')
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setAdding(true)
    await onAdd({
      content: content.trim(),
      page_num: pageNum ? parseInt(pageNum) : null,
      color,
    })
    setContent('')
    setPageNum('')
    setColor('yellow')
    setShowForm(false)
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brown-700 font-noto">
          하이라이트 ({highlights.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-noto px-3 py-1.5 rounded-lg transition"
        >
          + 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="border border-amber-200 rounded-xl p-4 bg-amber-50 space-y-3 animate-slide-up"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="인상 깊은 문장이나 구절을 입력하세요..."
            rows={3}
            required
            autoFocus
            className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-brown-700 font-noto text-sm placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="number"
              value={pageNum}
              onChange={(e) => setPageNum(e.target.value)}
              placeholder="쪽수 (선택)"
              min="1"
              className="w-24 px-3 py-1.5 border border-amber-200 rounded-lg bg-white text-brown-700 font-noto text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`w-6 h-6 rounded-full ${c.dot} transition-transform ${
                    color === c.key ? 'scale-125 ring-2 ring-brown-400' : ''
                  }`}
                  title={c.label}
                />
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-brown-400 hover:text-brown-600 font-noto px-2 py-1"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={adding || !content.trim()}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-noto px-4 py-1.5 rounded-lg transition"
              >
                저장
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 목록 */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-yellow-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : highlights.length === 0 ? (
        <EmptyState
          icon="✨"
          title="아직 하이라이트가 없습니다"
          description="인상 깊은 문장이나 구절을 기록해보세요."
        />
      ) : (
        <div className="space-y-3">
          {highlights.map((h) => (
            <HighlightCard key={h.id} highlight={h} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
