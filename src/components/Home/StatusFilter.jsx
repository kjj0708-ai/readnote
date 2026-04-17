const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'want', label: '읽고 싶어요' },
  { key: 'reading', label: '읽는 중' },
  { key: 'done', label: '완독' },
]

export default function StatusFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className="px-4 py-1.5 rounded-full text-sm font-noto font-medium transition-all duration-200"
          style={
            active === f.key
              ? {
                  background: 'linear-gradient(135deg, #C4915A, #A0673A)',
                  color: '#FFF8F0',
                  boxShadow: '0 2px 8px rgba(180,100,30,0.4)',
                  border: '1px solid rgba(200,140,80,0.5)',
                }
              : {
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(200,160,80,0.7)',
                  border: '1px solid rgba(180,120,60,0.2)',
                }
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
