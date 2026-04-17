import { useState } from 'react'
import { openYes24WithAffiliate } from '../../utils/yes24'

const STATUS_OPTIONS = [
  { value: 'want', label: '📌 읽고 싶어요' },
  { value: 'reading', label: '📖 읽는 중' },
  { value: 'done', label: '✅ 완독' },
]

export default function EditBookModal({ book, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    status: book.status || 'want',
    rating: book.rating || 0,
    start_date: book.start_date?.slice(0, 10) || '',
    end_date: book.end_date?.slice(0, 10) || '',
  })
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await onDelete()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(to bottom, #1C1008, #150C06)', border: '1px solid rgba(180,120,60,0.2)' }}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(180,120,60,0.1)' }}>
          {book.cover_url && (
            <img src={book.cover_url} alt={book.title}
              className="w-10 h-14 object-cover rounded shadow-lg flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-playfair font-bold text-sm leading-tight line-clamp-2" style={{ color: '#F0D5A0' }}>
              {book.title}
            </h3>
            <p className="font-noto text-xs mt-0.5 truncate" style={{ color: 'rgba(200,160,80,0.5)' }}>
              {book.author}
            </p>
          </div>
          <button onClick={onClose} className="text-xl leading-none flex-shrink-0"
            style={{ color: 'rgba(200,160,80,0.4)' }}>✕</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* 독서 상태 */}
          <div>
            <label className="block text-xs font-noto mb-2" style={{ color: 'rgba(200,160,80,0.6)' }}>독서 상태</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setForm(f => ({
                  ...f,
                  status: opt.value,
                  end_date: opt.value === 'done' && !f.end_date ? new Date().toISOString().slice(0, 10) : f.end_date,
                }))}
                  className="py-2 px-1 rounded-lg text-xs font-noto transition-all"
                  style={form.status === opt.value ? {
                    background: 'linear-gradient(135deg, #C4915A, #A0673A)',
                    color: '#FFF8F0',
                    boxShadow: '0 2px 8px rgba(180,100,30,0.4)',
                    border: '1px solid rgba(200,140,80,0.5)',
                  } : {
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(200,160,80,0.6)',
                    border: '1px solid rgba(180,120,60,0.15)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 별점 */}
          <div>
            <label className="block text-xs font-noto mb-2" style={{ color: 'rgba(200,160,80,0.6)' }}>별점</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setForm(f => ({ ...f, rating: f.rating === star ? 0 : star }))}
                  className="text-2xl transition-transform hover:scale-110"
                  style={{ color: star <= form.rating ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}
                >★</button>
              ))}
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'start_date', label: '시작일' },
              { key: 'end_date', label: '완독일' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-noto mb-1.5" style={{ color: 'rgba(200,160,80,0.6)' }}>{label}</label>
                <input type="date" value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-xs font-noto focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(180,120,60,0.2)',
                    color: '#F0D5A0',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Yes24 링크 */}
          <button
            onClick={() => openYes24WithAffiliate(book)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-noto transition-all cursor-pointer"
            style={{
              background: 'rgba(255,45,45,0.08)',
              border: '1px solid rgba(255,60,60,0.2)',
              color: 'rgba(255,140,140,0.8)',
            }}
          >
            <span>🔗</span>
            <span>Yes24에서 상세정보 보기</span>
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={handleDelete}
            className="px-4 py-2.5 rounded-lg text-sm font-noto transition-all"
            style={confirmDelete ? {
              background: 'rgba(220,50,50,0.2)',
              border: '1px solid rgba(220,50,50,0.4)',
              color: '#FF8080',
            } : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(180,120,60,0.15)',
              color: 'rgba(200,100,100,0.6)',
            }}
          >
            {confirmDelete ? '정말 삭제할까요?' : '🗑️ 삭제'}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-lg text-sm font-noto font-medium transition-all"
            style={{
              background: saving ? 'rgba(180,100,30,0.3)' : 'linear-gradient(135deg, #C4915A, #A0673A)',
              color: '#FFF8F0',
              boxShadow: saving ? 'none' : '0 2px 8px rgba(180,100,30,0.3)',
            }}
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
