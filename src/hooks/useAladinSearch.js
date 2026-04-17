import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aladin-search`

async function invokeAladin(payload) {
  const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Edge Function 오류 (${res.status}): ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`응답 파싱 실패: ${text.slice(0, 200)}`)
  }
}

export function useAladinSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (query) => {
    if (!query.trim()) return
    try {
      setLoading(true)
      setError(null)

      const data = await invokeAladin({ query: query.trim(), type: 'search' })
      const items = data?.item || []
      setResults(items)

      if (items.length === 0 && data?.error) {
        setError(`API 오류: ${data.error}`)
      }
    } catch (err) {
      console.error('도서 검색 오류:', err)
      setError(err.message || '도서 검색 중 오류가 발생했습니다.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const lookupBook = useCallback(async (isbn) => {
    try {
      const data = await invokeAladin({ query: isbn, type: 'lookup' })
      return { data: data?.item?.[0] || null, error: null }
    } catch (err) {
      console.error('도서 상세 조회 오류:', err)
      return { data: null, error: err.message }
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, search, lookupBook, clearResults }
}
