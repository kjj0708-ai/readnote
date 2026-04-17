import { useBooks } from '../hooks/useBooks'
import Header from '../components/Layout/Header'
import BookGrid from '../components/Home/BookGrid'

export default function LibraryPage() {
  const { books, loading, fetchBooks, addBook, updateBook, deleteBook } = useBooks()

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(180deg, #0F0804 0%, #1A0E07 40%, #130B05 100%)',
    }}>
      <Header onBookAdded={fetchBooks} addBook={addBook} />

      {/* 서재 분위기 조명 효과 */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(180,100,30,0.08) 0%, transparent 70%)',
      }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold" style={{ color: '#F0D5A0' }}>
            나의 서재
          </h1>
          <p className="font-noto text-sm mt-1" style={{ color: 'rgba(200,160,80,0.5)' }}>
            {books.length > 0 ? `${books.length}권의 책이 있습니다` : '첫 번째 책을 추가해보세요'}
          </p>
        </div>

        <BookGrid
          books={books}
          loading={loading}
          onUpdate={updateBook}
          onDelete={deleteBook}
        />
      </main>
    </div>
  )
}
