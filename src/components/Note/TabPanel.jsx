const TABS = [
  { key: 'memo', label: '📝 전체 메모' },
  { key: 'chapters', label: '📑 챕터별 노트' },
  { key: 'highlights', label: '✨ 하이라이트' },
]

export default function TabPanel({ active, onChange, children }) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 탭 헤더 */}
      <div className="border-b border-cream-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`px-4 py-3 text-sm font-noto font-medium transition border-b-2 -mb-px ${
                active === tab.key
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-brown-400 hover:text-brown-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
