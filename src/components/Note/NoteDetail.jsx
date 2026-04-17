import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBooks } from '../../hooks/useBooks'
import { useChapters } from '../../hooks/useChapters'
import { useHighlights } from '../../hooks/useHighlights'
import { generateDefaultChapters } from '../../utils/tocParser'
import BookHeader from './BookHeader'
import TabPanel from './TabPanel'
import MemoTab from './MemoTab'
import ChapterTab from './ChapterTab'
import HighlightTab from './HighlightTab'

export default function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchBookById, updateBook } = useBooks()
  const { chapters, loading: chaptersLoading, upsertChapter, addChapter, bulkAddChapters, renameChapter, deleteChapter, initializeChapters } = useChapters(id)
  const { highlights, loading: highlightsLoading, addHighlight, deleteHighlight, uploadImage } = useHighlights(id)

  const [book, setBook] = useState(null)
  const [bookLoading, setBookLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('memo')

  useEffect(() => {
    const load = async () => {
      setBookLoading(true)
      const { data, error } = await fetchBookById(id)
      if (error || !data) {
        navigate('/library')
        return
      }
      setBook(data)
      setBookLoading(false)
    }
    load()
  }, [id])


  const handleBookUpdate = useCallback(
    async (updates) => {
      if (!book) return
      const { data } = await updateBook(id, updates)
      if (data) setBook(data)
    },
    [id, book, updateBook]
  )

  const handleChapterSave = useCallback(
    async (chapterData) => {
      await upsertChapter(chapterData)
    },
    [upsertChapter]
  )

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">📖</div>
          <p className="text-brown-500 font-noto text-sm">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* 책 헤더 */}
      <BookHeader book={book} onUpdate={handleBookUpdate} />

      {/* 탭 패널 */}
      <TabPanel active={activeTab} onChange={setActiveTab}>
        {activeTab === 'memo' && (
          <MemoTab book={book} onSave={handleBookUpdate} />
        )}
        {activeTab === 'chapters' && (
          <ChapterTab
            chapters={chapters}
            onSave={handleChapterSave}
            onAddChapter={addChapter}
            onBulkAdd={bulkAddChapters}
            onRenameChapter={renameChapter}
            onDeleteChapter={deleteChapter}
            loading={chaptersLoading}
          />
        )}
        {activeTab === 'highlights' && (
          <HighlightTab
            highlights={highlights}
            onAdd={addHighlight}
            onDelete={deleteHighlight}
            onUploadImage={uploadImage}
            loading={highlightsLoading}
          />
        )}
      </TabPanel>
    </div>
  )
}
