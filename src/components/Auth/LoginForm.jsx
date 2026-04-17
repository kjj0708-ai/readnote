import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm({ onSwitch }) {
  const { signIn, signInWithGoogle, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해주세요.')
      } else {
        setError(`로그인 오류: ${error.message}`)
      }
    }
    setLoading(false)
  }

  const handleReset = async () => {
    if (!email) {
      setError('비밀번호 재설정을 위해 이메일을 먼저 입력해주세요.')
      return
    }
    setLoading(true)
    await resetPassword(email)
    setResetSent(true)
    setLoading(false)
  }

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(`구글 로그인 오류: ${error.message}`)
      setGoogleLoading(false)
    }
    // 성공 시 Supabase가 리다이렉트 처리
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-noto">
          {error}
        </div>
      )}
      {resetSent && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-noto">
          비밀번호 재설정 이메일을 보냈습니다. 받은 편지함을 확인해주세요.
        </div>
      )}

      {/* 구글 로그인 */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 border border-brown-200 bg-white hover:bg-cream-50 disabled:opacity-50 text-brown-700 font-medium py-2.5 px-4 rounded-lg transition font-noto text-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? '연결 중...' : 'Google로 로그인'}
      </button>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-cream-300" />
        <span className="text-brown-300 text-xs font-noto">또는</span>
        <hr className="flex-1 border-cream-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brown-600 mb-1.5 font-noto">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 border border-brown-200 rounded-lg bg-cream-50 text-brown-700 placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-noto text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-600 mb-1.5 font-noto">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-brown-200 rounded-lg bg-cream-50 text-brown-700 placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-noto text-sm transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full bg-brown-600 hover:bg-brown-700 disabled:bg-brown-300 text-cream-100 font-medium py-2.5 px-4 rounded-lg transition font-noto text-sm"
        >
          {loading ? '로그인 중...' : '이메일로 로그인'}
        </button>
      </form>

      <div className="flex justify-between items-center text-xs font-noto">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="text-brown-400 hover:text-brown-600 underline"
        >
          비밀번호 찾기
        </button>
        <button
          type="button"
          onClick={onSwitch}
          className="text-amber-600 hover:text-amber-700 underline"
        >
          계정이 없으신가요? 회원가입
        </button>
      </div>
    </div>
  )
}
