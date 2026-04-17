export default function SyncIndicator({ status }) {
  if (status === 'idle') return null

  const config = {
    saving: {
      icon: (
        <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin inline-block" />
      ),
      text: '저장 중...',
      color: 'text-amber-600',
    },
    saved: {
      icon: <span className="text-green-500">✓</span>,
      text: '저장됨',
      color: 'text-green-600',
    },
    offline: {
      icon: <span className="text-red-400">⚡</span>,
      text: '오프라인',
      color: 'text-red-500',
    },
    error: {
      icon: <span className="text-red-400">✕</span>,
      text: '저장 실패',
      color: 'text-red-500',
    },
  }[status] || null

  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-noto ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  )
}
