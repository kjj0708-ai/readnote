import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 자동 저장 훅
 * - 2초 디바운스 후 저장 함수 호출
 * - syncStatus: 'idle' | 'saving' | 'saved' | 'offline' | 'error'
 */
export function useAutoSave(saveFn, delay = 2000) {
  const [syncStatus, setSyncStatus] = useState('idle')
  const timerRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const triggerSave = useCallback(
    (data) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setSyncStatus('saving')

      timerRef.current = setTimeout(async () => {
        if (!isMountedRef.current) return

        if (!navigator.onLine) {
          setSyncStatus('offline')
          return
        }

        try {
          await saveFn(data)
          if (isMountedRef.current) {
            setSyncStatus('saved')
            // 3초 후 idle로 복귀
            setTimeout(() => {
              if (isMountedRef.current) setSyncStatus('idle')
            }, 3000)
          }
        } catch (err) {
          console.error('자동 저장 실패:', err)
          if (isMountedRef.current) setSyncStatus('error')
        }
      }, delay)
    },
    [saveFn, delay]
  )

  return { syncStatus, triggerSave }
}
