import { useState, useEffect, useCallback } from 'react'
import { useAutoSave } from '../../hooks/useAutoSave'
import SyncIndicator from './SyncIndicator'

export default function MemoTab({ book, onSave }) {
  const [memo, setMemo] = useState(book?.memo || '')

  const saveFn = useCallback(
    async (text) => {
      await onSave({ memo: text })
    },
    [onSave]
  )

  const { syncStatus, triggerSave } = useAutoSave(saveFn, 2000)

  useEffect(() => {
    setMemo(book?.memo || '')
  }, [book?.id])

  const handleChange = (e) => {
    const val = e.target.value
    setMemo(val)
    triggerSave(val)
  }

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brown-700 font-noto">전체 메모</h2>
        <SyncIndicator status={syncStatus} />
      </div>

      {/* 텍스트에어리어 */}
      <textarea
        value={memo}
        onChange={handleChange}
        placeholder="이 책에 대한 전반적인 생각, 감상, 인사이트를 자유롭게 기록해보세요..."
        className="w-full min-h-[400px] p-4 border border-brown-200 rounded-xl bg-cream-50 text-brown-700 font-noto text-sm leading-relaxed placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-y transition"
      />

      <p className="text-xs text-brown-300 font-noto text-right">
        {memo.length}자 · 입력 후 2초 뒤 자동 저장
      </p>
    </div>
  )
}
