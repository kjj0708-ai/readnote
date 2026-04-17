import { useState } from 'react'

export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star === value ? 0 : star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`text-xl transition-transform ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <span
            className={
              star <= (hovered || value)
                ? 'text-amber-500'
                : 'text-brown-200'
            }
          >
            ★
          </span>
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-brown-400 font-noto ml-1">{value}/5</span>
      )}
    </div>
  )
}
