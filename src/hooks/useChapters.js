import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useChapters(bookId) {
  const { user } = useAuth()
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchChapters = useCallback(async () => {
    if (!bookId || !user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_index', { ascending: true })

      if (error) throw error
      setChapters(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [bookId, user])

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters])

  const upsertChapter = async (chapterData) => {
    if (!user) return { error: '로그인이 필요합니다.' }
    const payload = {
      ...chapterData,
      book_id: bookId,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }

    // 이미 존재하는 챕터인지 확인
    const existing = chapters.find(
      (c) => c.chapter_index === chapterData.chapter_index
    )

    let result
    if (existing) {
      result = await supabase
        .from('chapters')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('chapters')
        .insert([payload])
        .select()
        .single()
    }

    const { data, error } = result
    if (!error) {
      setChapters((prev) => {
        const idx = prev.findIndex(
          (c) => c.chapter_index === chapterData.chapter_index
        )
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = data
          return next
        }
        return [...prev, data].sort((a, b) => a.chapter_index - b.chapter_index)
      })
    }
    return { data, error }
  }

  const initializeChapters = async (tocChapters) => {
    if (!user || !bookId) return
    // 이미 챕터가 있으면 스킵
    const { data: existing } = await supabase
      .from('chapters')
      .select('id')
      .eq('book_id', bookId)
      .limit(1)

    if (existing && existing.length > 0) return

    const rows = tocChapters.map((ch) => ({
      book_id: bookId,
      user_id: user.id,
      chapter_index: ch.index,
      title: ch.title,
      summary: '',
      notes: '',
      highlight: '',
    }))

    const { data, error } = await supabase
      .from('chapters')
      .insert(rows)
      .select()

    if (!error) setChapters(data || [])
    return { data, error }
  }

  const addChapter = async (title) => {
    if (!user || !bookId) return
    const nextIndex = chapters.length > 0
      ? Math.max(...chapters.map(c => c.chapter_index)) + 1
      : 0
    const { data, error } = await supabase
      .from('chapters')
      .insert([{ book_id: bookId, user_id: user.id, chapter_index: nextIndex, title, summary: '', notes: '', highlight: '' }])
      .select()
      .single()
    if (!error) setChapters(prev => [...prev, data])
    return { data, error }
  }

  const bulkAddChapters = async (parsedChapters) => {
    if (!user || !bookId) return
    const startIndex = chapters.length > 0
      ? Math.max(...chapters.map(c => c.chapter_index)) + 1
      : 0
    const rows = parsedChapters.map((ch, i) => ({
      book_id: bookId,
      user_id: user.id,
      chapter_index: startIndex + i,
      title: ch.title,
      summary: '', notes: '', highlight: '',
    }))
    const { data, error } = await supabase.from('chapters').insert(rows).select()
    if (!error) setChapters(prev => [...prev, ...data].sort((a, b) => a.chapter_index - b.chapter_index))
    return { data, error }
  }

  const renameChapter = async (chapterIndex, title) => {
    const existing = chapters.find(c => c.chapter_index === chapterIndex)
    if (!existing) return
    const { data, error } = await supabase
      .from('chapters')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
    if (!error) setChapters(prev => prev.map(c => c.chapter_index === chapterIndex ? data : c))
    return { data, error }
  }

  const deleteChapter = async (chapterIndex) => {
    const existing = chapters.find(c => c.chapter_index === chapterIndex)
    if (!existing) return
    const { error } = await supabase.from('chapters').delete().eq('id', existing.id)
    if (!error) setChapters(prev => prev.filter(c => c.chapter_index !== chapterIndex))
    return { error }
  }

  return {
    chapters,
    loading,
    error,
    fetchChapters,
    upsertChapter,
    addChapter,
    bulkAddChapters,
    renameChapter,
    deleteChapter,
    initializeChapters,
  }
}
