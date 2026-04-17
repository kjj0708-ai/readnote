import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarView({ books }) {
  const navigate = useNavigate()
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const doneBooks = useMemo(
    () => books.filter(b => b.status === 'done' && b.end_date),
    [books]
  )

  const booksByDate = useMemo(() => {
    const map = {}
    doneBooks.forEach(b => {
      const key = b.end_date.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(b)
    })
    return map
  }, [doneBooks])

  const calendarDays = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = Array(firstWeekday).fill(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    return days
  }, [year, month])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

  const isToday = (day) =>
    day &&
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day

  const totalDone = doneBooks.length
  const thisMonthDone = doneBooks.filter(b => {
    const d = new Date(b.end_date)
    return d.getFullYear() === year && d.getMonth() === month
  }).length

  return (
    <div className="space-y-4">
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(180,120,60,0.08)', border: '1px solid rgba(180,120,60,0.15)' }}>
          <p className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.5)' }}>이번 달 완독</p>
          <p className="font-noto text-2xl font-bold mt-0.5" style={{ color: '#F0D5A0' }}>{thisMonthDone}<span className="text-sm font-normal ml-1">권</span></p>
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(180,120,60,0.08)', border: '1px solid rgba(180,120,60,0.15)' }}>
          <p className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.5)' }}>총 완독</p>
          <p className="font-noto text-2xl font-bold mt-0.5" style={{ color: '#F0D5A0' }}>{totalDone}<span className="text-sm font-normal ml-1">권</span></p>
        </div>
      </div>

      {/* 캘린더 카드 */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,12,6,0.6)', border: '1px solid rgba(180,120,60,0.15)' }}>
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(180,120,60,0.1)' }}>
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-noto text-sm transition"
            style={{ color: 'rgba(200,160,80,0.6)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,120,60,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >‹</button>
          <div className="flex items-center gap-3">
            <h2 className="font-noto font-semibold" style={{ color: '#F0D5A0' }}>
              {year}년 {month + 1}월
            </h2>
            <button
              onClick={goToday}
              className="text-xs font-noto px-2 py-0.5 rounded"
              style={{ color: 'rgba(200,160,80,0.5)', border: '1px solid rgba(180,120,60,0.2)' }}
            >오늘</button>
          </div>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-noto text-sm transition"
            style={{ color: 'rgba(200,160,80,0.6)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,120,60,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >›</button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-2 pt-3 pb-1">
          {WEEKDAYS.map((d, i) => (
            <div key={d} className="text-center text-xs font-noto font-medium py-1"
              style={{ color: i === 0 ? 'rgba(239,68,68,0.6)' : i === 6 ? 'rgba(96,165,250,0.6)' : 'rgba(200,160,80,0.4)' }}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-0.5 px-2 pb-3">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="aspect-square" />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayBooks = booksByDate[dateStr] || []
            const todayFlag = isToday(day)
            const weekday = (idx) % 7

            return (
              <div
                key={dateStr}
                className="aspect-square rounded-lg flex flex-col items-center p-0.5 transition"
                style={{
                  background: todayFlag ? 'rgba(180,120,60,0.2)' : dayBooks.length > 0 ? 'rgba(180,120,60,0.06)' : 'transparent',
                  border: todayFlag ? '1px solid rgba(180,120,60,0.4)' : '1px solid transparent',
                }}
              >
                <span className="text-xs font-noto leading-tight"
                  style={{
                    color: todayFlag ? '#F59E0B'
                      : weekday === 0 ? 'rgba(239,68,68,0.7)'
                      : weekday === 6 ? 'rgba(96,165,250,0.7)'
                      : 'rgba(200,160,80,0.5)',
                    fontWeight: todayFlag ? '700' : '400',
                  }}>
                  {day}
                </span>
                {dayBooks.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-0.5 mt-0.5 w-full">
                    {dayBooks.slice(0, 2).map(book => (
                      <img
                        key={book.id}
                        src={book.cover_url}
                        alt={book.title}
                        title={book.title}
                        onClick={() => navigate(`/book/${book.id}`)}
                        className="rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ width: '20px', height: '28px', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ))}
                    {dayBooks.length > 2 && (
                      <span className="text-xs font-noto" style={{ color: 'rgba(200,160,80,0.5)', fontSize: '9px' }}>
                        +{dayBooks.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 이달 완독 목록 */}
      {thisMonthDone > 0 && (
        <div className="space-y-2">
          <h3 className="font-noto text-sm font-medium" style={{ color: 'rgba(200,160,80,0.6)' }}>
            {month + 1}월 완독 목록
          </h3>
          {doneBooks
            .filter(b => {
              const d = new Date(b.end_date)
              return d.getFullYear() === year && d.getMonth() === month
            })
            .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))
            .map(book => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition"
                style={{ background: 'rgba(20,12,6,0.5)', border: '1px solid rgba(180,120,60,0.1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,120,60,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(20,12,6,0.5)'}
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="rounded"
                  style={{ width: '32px', height: '44px', objectFit: 'cover' }}
                  onError={e => { e.target.style.background = 'rgba(180,120,60,0.2)' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-noto text-sm font-medium truncate" style={{ color: '#F0D5A0' }}>{book.title}</p>
                  <p className="font-noto text-xs truncate" style={{ color: 'rgba(200,160,80,0.5)' }}>{book.author}</p>
                </div>
                <span className="font-noto text-xs flex-shrink-0" style={{ color: 'rgba(200,160,80,0.4)' }}>
                  {book.end_date.slice(5).replace('-', '/')}
                </span>
              </div>
            ))}
        </div>
      )}

      {totalDone === 0 && (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">📅</p>
          <p className="font-noto text-sm" style={{ color: 'rgba(200,160,80,0.4)' }}>완독한 책이 없습니다</p>
          <p className="font-noto text-xs mt-1" style={{ color: 'rgba(200,160,80,0.25)' }}>책을 완독하면 달력에 표지가 표시됩니다</p>
        </div>
      )}
    </div>
  )
}
