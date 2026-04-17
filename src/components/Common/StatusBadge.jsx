const STATUS_MAP = {
  want: { label: '읽고 싶어요', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  reading: { label: '읽는 중', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  done: { label: '완독', color: 'bg-green-100 text-green-700 border-green-200' },
}

export default function StatusBadge({ status, onChange, editable = false }) {
  const current = STATUS_MAP[status] || STATUS_MAP.want

  if (!editable) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-noto ${current.color}`}
      >
        {current.label}
      </span>
    )
  }

  return (
    <select
      value={status || 'want'}
      onChange={(e) => onChange?.(e.target.value)}
      className="text-xs font-noto border rounded-full px-2.5 py-0.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
    >
      {Object.entries(STATUS_MAP).map(([key, { label }]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  )
}
