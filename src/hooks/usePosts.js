import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function usePosts() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const addPost = async ({ type, title, content }) => {
    if (!user) return { error: '로그인이 필요합니다.' }
    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id: user.id, author_email: user.email, type, title, content }])
      .select()
      .single()
    if (!error) setPosts(prev => [data, ...prev])
    return { data, error }
  }

  const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) setPosts(prev => prev.filter(p => p.id !== id))
    return { error }
  }

  return { posts, loading, fetchPosts, addPost, deletePost }
}
