import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAladinSearch } from '../../hooks/useAladinSearch'
import { useAuth } from '../../hooks/useAuth'
import { parseToc } from '../../utils/tocParser'
import { supabase } from '../../lib/supabase'
import SearchResult from './SearchResult'

export default function SearchModal({ onClose, onBookAdded, addBook }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { results, loading, error, search, lookupBook, clearResults } = useAladinSearch()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ESC로 닫기
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleQueryChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length >= 2) {
      debounceRef.current = setTimeout(() => search(val), 500)
    } else {
      clearResults()
    }
  }

  const handleSelect = async (book) => {
    if (!user) return
    setAdding(true)
    setAddError('')

    try {
      // ISBN이 있으면 상세 정보 조회 (TOC 포함)
      let toc = ''
      let detailCover = book.cover || ''

      let yes24Id = ''
      if (book.isbn13 || book.isbn) {
        const { data: detail } = await lookupBook(book.isbn13 || book.isbn)
        if (detail) {
          toc = detail.toc || detail.bookinfo?.toc || detail.subInfo?.toc || detail.subinfo?.toc || ''
          detailCover = detail.cover || detailCover
          yes24Id = detail.yes24_id || ''
        }
      }

      // 책 추가
      const { data: newBook, error: bookError } = await addBook({
        isbn: book.isbn13 || book.isbn || '',
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        cover_url: detailCover,
        pub_date: book.pubDate ? book.pubDate.slice(0, 10) : null,
        status: 'want',
        memo: '',
        yes24_id: yes24Id,
      })

      if (bookError) throw new Error(bookError.message || '도서 추가 실패')

      // 챕터 생성: TOC가 있을 때만 파싱해서 생성
      if (newBook?.id && toc) {
        const parsedChapters = parseToc(toc)
        if (parsedChapters.length > 0) {
          const rows = parsedChapters.map((ch) => ({
            book_id: newBook.id,
            user_id: user.id,
            chapter_index: ch.index,
            title: ch.title,
            summary: '',
            notes: '',
            highlight: '',
          }))
          await supabase.from('chapters').insert(rows)
        }
      }

      onBookAdded?.()
      if (newBook?.id) {
        navigate(`/book/${newBook.id}`)
      }
    } catch (err) {
      setAddError(err.message || '도서 추가 중 오류가 발생했습니다.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-brown-800/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* 헤더 */}
        <div className="px-5 pt-5 pb-3 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="책 제목 또는 저자 검색..."
              className="flex-1 text-base font-noto text-brown-700 placeholder-brown-300 focus:outline-none bg-transparent"
            />
            <button
              onClick={onClose}
              className="text-brown-400 hover:text-brown-600 transition text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 결과 영역 */}
        <div className="max-h-[60vh] overflow-y-auto">
          {addError && (
            <div className="mx-4 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-noto">
              {addError}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-10 gap-2">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-brown-400 font-noto text-sm">검색 중...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <p className="text-brown-400 font-noto text-sm">{error}</p>
              <p className="text-xs text-brown-300 font-noto mt-1">
                Supabase Edge Function이 배포되어 있어야 합니다.
              </p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="p-2">
              {results.map((book, i) => (
                <SearchResult
                  key={book.isbn13 || book.isbn || i}
                  book={book}
                  onSelect={handleSelect}
                  loading={adding}
                />
              ))}
            </div>
          )}

          {!loading && !error && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-10">
              <p className="text-brown-400 font-noto text-sm">검색 결과가 없습니다.</p>
            </div>
          )}

          {!query && (
            <div className="text-center py-10">
              <p className="text-brown-300 font-noto text-sm">
                검색어를 입력하면 알라딘에서 책을 찾아드립니다.
              </p>
            </div>
          )}
        </div>

        {adding && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-brown-600 font-noto text-sm">도서를 추가하는 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
