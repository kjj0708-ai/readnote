import { useState } from 'react'
import { useBooks } from '../hooks/useBooks'
import Header from '../components/Layout/Header'
import BookGrid from '../components/Home/BookGrid'
import CalendarView from '../components/Home/CalendarView'
import BestsellerView from '../components/Home/BestsellerView'
import BoardView from '../components/Home/BoardView'

const TABS = [
  { key: 'library', label: '서재', icon: '📚' },
  { key: 'calendar', label: '캘린더', icon: '📅' },
  { key: 'bestseller', label: '베스트셀러', icon: '🏆' },
  { key: 'board', label: '게시판', icon: '📢' },
]

export default function LibraryPage() {
  const { books, loading, fetchBooks, addBook, updateBook, deleteBook } = useBooks()
  const [activeTab, setActiveTab] = useState('library')

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(180deg, #0F0804 0%, #1A0E07 40%, #130B05 100%)',
    }}>
      <Header onBookAdded={fetchBooks} addBook={addBook} />

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(180,100,30,0.08) 0%, transparent 70%)',
      }} />

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-8">
        {/* 탭 네비게이션 */}
        <div className="flex gap-1 mb-3 p-1 rounded-xl w-fit" style={{ background: 'rgba(20,12,6,0.6)', border: '1px solid rgba(180,120,60,0.12)' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-noto font-medium transition-all duration-200"
              style={activeTab === tab.key ? {
                background: 'linear-gradient(135deg, #C4915A, #A0673A)',
                color: '#FFF8F0',
                boxShadow: '0 2px 8px rgba(180,100,30,0.3)',
              } : {
                color: 'rgba(200,160,80,0.5)',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'library' && (
          <BookGrid books={books} loading={loading} onUpdate={updateBook} onDelete={deleteBook} />
        )}
        {activeTab === 'calendar' && (
          <CalendarView books={books} />
        )}
        {activeTab === 'bestseller' && (
          <BestsellerView />
        )}
        {activeTab === 'board' && (
          <BoardView />
        )}
      </main>
    </div>
  )
}
