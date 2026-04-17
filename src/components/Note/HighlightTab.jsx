import { useState, useRef } from 'react'
import EmptyState from '../Common/EmptyState'
import { formatDate } from '../../utils/dateFormat'

const COLORS = [
  { key: 'yellow', label: '노랑', bg: 'bg-yellow-100 border-yellow-300', dot: 'bg-yellow-400' },
  { key: 'green', label: '초록', bg: 'bg-green-100 border-green-300', dot: 'bg-green-400' },
  { key: 'blue', label: '파랑', bg: 'bg-blue-100 border-blue-300', dot: 'bg-blue-400' },
  { key: 'pink', label: '핑크', bg: 'bg-pink-100 border-pink-300', dot: 'bg-pink-400' },
]

const MAX_FILE_BYTES = 500 * 1024 // 500 KB 목표

async function resizeToUnder500kb(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const canvas = document.createElement('canvas')
      let w = img.naturalWidth
      let h = img.naturalHeight
      let quality = 0.85

      const compress = () => {
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('이미지 변환 실패')); return }
            if (blob.size <= MAX_FILE_BYTES || (quality <= 0.3 && w <= 300)) {
              resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
            } else if (quality > 0.3) {
              quality = Math.max(quality - 0.12, 0.3)
              compress()
            } else {
              w = Math.floor(w * 0.75)
              h = Math.floor(h * 0.75)
              quality = 0.75
              compress()
            }
          },
          'image/jpeg',
          quality,
        )
      }
      compress()
    }
    img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다'))
    img.src = objectUrl
  })
}

function HighlightCard({ highlight, onDelete }) {
  const colorConfig = COLORS.find((c) => c.key === highlight.color) || COLORS[0]
  const [confirming, setConfirming] = useState(false)

  return (
    <div className={`relative border rounded-xl p-4 ${colorConfig.bg} group`}>
      {highlight.image_url && (
        <img
          src={highlight.image_url}
          alt="하이라이트 이미지"
          className="w-full max-h-56 object-contain rounded-lg mb-3"
        />
      )}
      {highlight.content && (
        <blockquote className="font-noto text-brown-700 text-sm leading-relaxed italic">
          "{highlight.content}"
        </blockquote>
      )}
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

export default function HighlightTab({ highlights, onAdd, onDelete, onUploadImage, loading }) {
  const [content, setContent] = useState('')
  const [pageNum, setPageNum] = useState('')
  const [color, setColor] = useState('yellow')
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState('')
  const [resizing, setResizing] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageError('')
    setResizing(true)
    try {
      const resized = await resizeToUnder500kb(file)
      setImageFile(resized)
      setImagePreview(URL.createObjectURL(resized))
    } catch (err) {
      setImageError(err.message)
    } finally {
      setResizing(false)
      e.target.value = ''
    }
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setImageError('')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!content.trim() && !imageFile) return
    setAdding(true)
    try {
      let image_url = null
      if (imageFile) {
        const result = await onUploadImage(imageFile)
        if (result?.error) {
          setImageError(result.error)
          setAdding(false)
          return
        }
        image_url = result?.url || null
      }
      await onAdd({
        content: content.trim(),
        page_num: pageNum ? parseInt(pageNum) : null,
        color,
        image_url,
      })
      setContent('')
      setPageNum('')
      setColor('yellow')
      clearImage()
      setShowForm(false)
    } finally {
      setAdding(false)
    }
  }

  const handleCancel = () => {
    clearImage()
    setContent('')
    setPageNum('')
    setColor('yellow')
    setImageError('')
    setShowForm(false)
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
            placeholder="인상 깊은 문장이나 구절을 입력하세요... (사진만 저장도 가능)"
            rows={3}
            autoFocus
            className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-brown-700 font-noto text-sm placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />

          {/* 이미지 업로드 영역 */}
          <div>
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="미리보기" className="max-h-40 rounded-lg object-contain border border-amber-200" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                >
                  ✕
                </button>
                <span className="block text-xs text-brown-400 font-noto mt-1">
                  {(imageFile.size / 1024).toFixed(0)}KB
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={resizing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-noto border border-amber-300 bg-white text-brown-500 hover:bg-amber-100 transition"
              >
                {resizing ? '리사이징 중...' : '📷 사진 추가'}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            {imageError && (
              <p className="text-xs text-red-500 font-noto mt-1">{imageError}</p>
            )}
          </div>

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
                onClick={handleCancel}
                className="text-sm text-brown-400 hover:text-brown-600 font-noto px-2 py-1"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={adding || resizing || (!content.trim() && !imageFile)}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-noto px-4 py-1.5 rounded-lg transition"
              >
                {adding ? '저장 중...' : '저장'}
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
          description="인상 깊은 문장이나 사진을 기록해보세요."
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
