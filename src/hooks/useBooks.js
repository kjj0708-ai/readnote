import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useBooks() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBooks = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // Realtime 구독
  useEffect(() => {
    if (!user) return
    const subscription = supabase
      .channel('books-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchBooks()
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [user, fetchBooks])

  const addBook = async (bookData) => {
    if (!user) return { error: '로그인이 필요합니다.' }
    const { data, error } = await supabase
      .from('books')
      .insert([{ ...bookData, user_id: user.id }])
      .select()
      .single()

    if (!error) setBooks((prev) => [data, ...prev])
    return { data, error }
  }

  const updateBook = async (id, updates) => {
    const { data, error } = await supabase
      .from('books')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      setBooks((prev) => prev.map((b) => (b.id === id ? data : b)))
    }
    return { data, error }
  }

  const deleteBook = async (id) => {
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (!error) setBooks((prev) => prev.filter((b) => b.id !== id))
    return { error }
  }

  const getBook = useCallback(
    (id) => books.find((b) => b.id === id) || null,
    [books]
  )

  const fetchBookById = async (id) => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    fetchBookById,
  }
}
