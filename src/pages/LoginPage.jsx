import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/Auth/LoginForm'
import SignupForm from '../components/Auth/SignupForm'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  useEffect(() => {
    if (!loading && user) {
      navigate('/library', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-4xl animate-bounce">📚</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl opacity-5 rotate-12">📚</div>
        <div className="absolute bottom-10 right-10 text-8xl opacity-5 -rotate-12">📖</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-5 rotate-6">✒️</div>
      </div>

      <div className="relative w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="font-playfair text-3xl font-bold text-brown-700">
            ReadNote
          </h1>
          <p className="text-brown-400 font-noto text-sm mt-1">
            나만의 독서 노트를 시작해보세요
          </p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-book p-6 sm:p-8">
          {/* 탭 */}
          <div className="flex mb-6 border-b border-cream-200">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 pb-3 text-sm font-noto font-medium transition border-b-2 -mb-px ${
                tab === 'login'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-brown-400 hover:text-brown-600'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 pb-3 text-sm font-noto font-medium transition border-b-2 -mb-px ${
                tab === 'signup'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-brown-400 hover:text-brown-600'
              }`}
            >
              회원가입
            </button>
          </div>

          {tab === 'login' ? (
            <LoginForm onSwitch={() => setTab('signup')} />
          ) : (
            <SignupForm onSwitch={() => setTab('login')} />
          )}
        </div>

        <p className="text-center text-xs text-brown-300 font-noto mt-6">
          ReadNote · 나의 독서 여정을 기록합니다
        </p>
      </div>
    </div>
  )
}
