import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'

const ADMIN_EMAIL = 'kjj0708@gmail.com'

const TYPE_OPTIONS = [
  { value: 'review', label: '사용후기' },
  { value: 'suggestion', label: '건의사항' },
]

const TYPE_BADGE = {
  notice:     { label: '공지', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  review:     { label: '후기', bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'rgba(52,211,153,0.25)' },
  suggestion: { label: '건의', bg: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: 'rgba(96,165,250,0.25)' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}일 전`
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

function PostCard({ post, onDelete, canDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const badge = TYPE_BADGE[post.type] || TYPE_BADGE.review

  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{ background: 'rgba(20,12,6,0.6)', border: '1px solid rgba(180,120,60,0.12)' }}
    >
      <div className="flex items-start gap-2">
        <span
          className="flex-shrink-0 text-xs font-noto px-2 py-0.5 rounded-full mt-0.5"
          style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
        >
          {badge.label}
        </span>
        <div className="flex-1 min-w-0">
          <button
            className="text-left w-full"
            onClick={() => setExpanded(e => !e)}
          >
            <p className="font-noto text-sm font-medium" style={{ color: '#F0D5A0' }}>{post.title}</p>
          </button>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {post.type === 'review' && post.rating > 0 && (
              <span className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-xs" style={{ color: i <= post.rating ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}>★</span>
                ))}
              </span>
            )}
            <span className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.35)' }}>
              {post.author_email?.split('@')[0]}
            </span>
            <span className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.25)' }}>
              {timeAgo(post.created_at)}
            </span>
          </div>
          {expanded && (
            <p className="font-noto text-sm mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(200,160,80,0.7)' }}>
              {post.content}
            </p>
          )}
        </div>
        {canDelete && (
          <div className="flex-shrink-0">
            {confirming ? (
              <div className="flex gap-1">
                <button onClick={() => onDelete(post.id)} className="text-xs font-noto" style={{ color: '#F87171' }}>삭제</button>
                <button onClick={() => setConfirming(false)} className="text-xs font-noto" style={{ color: 'rgba(200,160,80,0.4)' }}>취소</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} className="text-xs font-noto" style={{ color: 'rgba(200,160,80,0.25)' }}>✕</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function WriteForm({ onSubmit, isAdmin }) {
  const [type, setType] = useState(isAdmin ? 'notice' : 'review')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const options = isAdmin
    ? [{ value: 'notice', label: '공지사항' }, ...TYPE_OPTIONS]
    : TYPE_OPTIONS

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    setError('')
    const result = await onSubmit({ type, title: title.trim(), content: content.trim(), rating: type === 'review' ? rating : null })
    if (result?.error) {
      setError(typeof result.error === 'string' ? result.error : result.error.message || '등록 실패')
    } else {
      setTitle('')
      setContent('')
      setRating(0)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(20,12,6,0.7)', border: '1px solid rgba(180,120,60,0.2)' }}>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setType(opt.value)}
            className="text-xs font-noto px-3 py-1 rounded-full transition"
            style={type === opt.value ? {
              background: 'linear-gradient(135deg, #C4915A, #A0673A)',
              color: '#FFF8F0',
            } : {
              background: 'rgba(180,120,60,0.1)',
              color: 'rgba(200,160,80,0.5)',
              border: '1px solid rgba(180,120,60,0.2)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목"
        required
        className="w-full px-3 py-2 rounded-lg text-sm font-noto focus:outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(180,120,60,0.2)', color: '#F0D5A0' }}
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
        rows={4}
        required
        className="w-full px-3 py-2 rounded-lg text-sm font-noto focus:outline-none resize-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(180,120,60,0.2)', color: '#F0D5A0' }}
      />
      {type === 'review' && (
        <div className="flex items-center gap-2">
          <span className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.5)' }}>별점</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(rating === i ? 0 : i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-xl transition-transform hover:scale-110"
                style={{ color: i <= (hoverRating || rating) ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}
              >★</button>
            ))}
          </div>
          {rating > 0 && (
            <span className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.4)' }}>{rating}점</span>
          )}
        </div>
      )}
      {error && (
        <p className="text-xs font-noto px-1" style={{ color: '#F87171' }}>
          오류: {error}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !title.trim() || !content.trim()}
          className="px-5 py-2 rounded-lg text-sm font-noto font-medium transition"
          style={{
            background: 'linear-gradient(135deg, #C4915A, #A0673A)',
            color: '#FFF8F0',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  )
}

export default function BoardView() {
  const { user } = useAuth()
  const { posts, loading, addPost, deletePost } = usePosts()
  const [showForm, setShowForm] = useState(false)

  const isAdmin = user?.email === ADMIN_EMAIL
  const notices = posts.filter(p => p.type === 'notice')
  const userPosts = posts.filter(p => p.type !== 'notice')

  const handleAdd = async (data) => {
    const result = await addPost(data)
    if (!result?.error) setShowForm(false)
    return result
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* 공지사항 */}
      {notices.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-noto text-xs font-semibold uppercase tracking-wider" style={{ color: '#F59E0B' }}>
            공지사항
          </h3>
          {notices.map(p => (
            <PostCard
              key={p.id}
              post={p}
              onDelete={deletePost}
              canDelete={isAdmin}
            />
          ))}
        </div>
      )}

      {/* 사용자 게시글 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="font-noto text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(200,160,80,0.5)' }}>
          사용후기 · 건의
        </h3>
        {user && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="text-xs font-noto px-3 py-1.5 rounded-lg transition"
            style={{
              background: showForm ? 'rgba(180,120,60,0.2)' : 'rgba(180,120,60,0.1)',
              color: 'rgba(200,160,80,0.7)',
              border: '1px solid rgba(180,120,60,0.2)',
            }}
          >
            {showForm ? '취소' : '+ 글쓰기'}
          </button>
        )}
      </div>

      {showForm && <WriteForm onSubmit={handleAdd} isAdmin={isAdmin} />}

      {/* 게시글 목록 */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : userPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">📝</p>
          <p className="font-noto text-sm" style={{ color: 'rgba(200,160,80,0.35)' }}>
            아직 게시글이 없습니다
          </p>
          <p className="font-noto text-xs mt-1" style={{ color: 'rgba(200,160,80,0.2)' }}>
            사용 후기나 건의사항을 남겨주세요
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {userPosts.map(p => (
            <PostCard
              key={p.id}
              post={p}
              onDelete={deletePost}
              canDelete={isAdmin || p.user_id === user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
