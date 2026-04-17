export default function EmptyState({
  icon = '📚',
  title = '아직 내용이 없습니다',
  description = '',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-lg font-medium text-brown-600 font-noto mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-brown-400 font-noto max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
