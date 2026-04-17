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

  const STORAGE_BUCKET = 'highlight-images'
  const MAX_USER_BYTES = 30 * 1024 * 1024 // 30 MB

  const getUserStorageUsed = async () => {
    const { data: files } = await supabase.storage.from(STORAGE_BUCKET).list(user.id, { limit: 1000 })
    if (!files) return 0
    return files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0)
  }

  const uploadImage = async (file) => {
    const used = await getUserStorageUsed()
    if (used + file.size > MAX_USER_BYTES) {
      return { error: `이미지 저장 한도(30MB)를 초과했습니다. (현재 ${(used / 1024 / 1024).toFixed(1)}MB 사용 중)` }
    }
    const ext = file.type === 'image/png' ? 'png' : 'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { contentType: file.type })
    if (error) return { error: error.message }
    const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return { url: publicUrl, path }
  }

  const addHighlight = async ({ content, page_num, color = 'yellow', image_url = null }) => {
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
          image_url,
        },
      ])
      .select()
      .single()

    if (!error) setHighlights((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteHighlight = async (id) => {
    const highlight = highlights.find(h => h.id === id)
    if (highlight?.image_url) {
      const path = highlight.image_url.split(`${STORAGE_BUCKET}/`)[1]
      if (path) await supabase.storage.from(STORAGE_BUCKET).remove([path])
    }
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
    uploadImage,
  }
}
