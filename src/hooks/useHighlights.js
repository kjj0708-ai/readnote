import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useHighlights(bookId) {
  const { user } = useAuth()
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHighlights = useCallback(async () => {
    if (!bookId || !user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHighlights(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [bookId, user])

  useEffect(() => {
    fetchHighlights()
  }, [fetchHighlights])

  const addHighlight = async ({ content, page_num, color = 'yellow' }) => {
    if (!user) return { error: '로그인이 필요합니다.' }
    const { data, error } = await supabase
      .from('highlights')
      .insert([
        {
          book_id: bookId,
          user_id: user.id,
          content,
          page_num: page_num || null,
          color,
        },
      ])
      .select()
      .single()

    if (!error) setHighlights((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteHighlight = async (id) => {
    const { error } = await supabase.from('highlights').delete().eq('id', id)
    if (!error) setHighlights((prev) => prev.filter((h) => h.id !== id))
    return { error }
  }

  return {
    highlights,
    loading,
    error,
    fetchHighlights,
    addHighlight,
    deleteHighlight,
  }
}
