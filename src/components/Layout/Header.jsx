import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import SearchModal from '../Search/SearchModal'

export default function Header({ onBookAdded, addBook }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-40" style={{
        background: 'linear-gradient(to bottom, rgba(10,5,2,0.98), rgba(15,8,4,0.95))',
        borderBottom: '1px solid rgba(180,120,60,0.15)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link to="/library" className="flex items-center gap-2.5 group">
              <span className="text-2xl">📚</span>
              <span className="font-playfair text-xl font-bold transition"
                style={{ color: '#F0D5A0' }}
                onMouseEnter={e => e.target.style.color = '#F59E0B'}
                onMouseLeave={e => e.target.style.color = '#F0D5A0'}
              >
                ReadNote
              </span>
            </Link>

            {/* 우측 액션 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-noto font-medium transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #C4915A, #A0673A)',
                  color: '#FFF8F0',
                  boxShadow: '0 2px 8px rgba(180,100,30,0.3)',
                  border: '1px solid rgba(200,140,80,0.3)',
                }}
              >
                <span>+</span>
                <span className="hidden sm:inline">도서 추가</span>
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #8B5E3C, #5C3A1E)',
                      color: '#F0D5A0',
                      border: '1px solid rgba(180,120,60,0.3)',
                    }}
                  >
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 rounded-xl py-1 z-50 overflow-hidden"
                      style={{
                        background: 'rgba(20,12,6,0.97)',
                        border: '1px solid rgba(180,120,60,0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <div className="px-4 py-2.5" style={{ borderBottom: '1px solid rgba(180,120,60,0.1)' }}>
                        <p className="text-xs font-noto truncate" style={{ color: 'rgba(200,160,80,0.5)' }}>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2.5 text-sm font-noto transition-colors"
                        style={{ color: 'rgba(200,160,80,0.7)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,100,30,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 검색 모달 */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          addBook={addBook}
          onBookAdded={() => {
            setShowSearch(false)
            onBookAdded?.()
          }}
        />
      )}

      {/* 오버레이 클릭으로 메뉴 닫기 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}
