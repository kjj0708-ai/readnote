const AFFILIATE_URL = import.meta.env.VITE_YES24_AFFILIATE_URL || ''

const CATEGORIES = [
  { name: '종합 베스트셀러', icon: '🏆', desc: '지금 가장 많이 읽히는 책', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001', color: '#F59E0B' },
  { name: '경제 · 경영', icon: '💼', desc: '투자 · 마케팅 · 리더십', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001001017', color: '#34D399' },
  { name: '자기계발', icon: '🚀', desc: '습관 · 생산성 · 목표', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001001021', color: '#60A5FA' },
  { name: '국내소설', icon: '📖', desc: '한국 작가의 이야기', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001001003001', color: '#F472B6' },
  { name: '에세이', icon: '✍️', desc: '일상 · 감성 · 치유', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001001025', color: '#A78BFA' },
  { name: '인문 · 교양', icon: '🧠', desc: '철학 · 역사 · 심리', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001001013', color: '#FB923C' },
  { name: '과학 · 기술', icon: '🔬', desc: 'AI · 우주 · 미래', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001001019', color: '#2DD4BF' },
  { name: '외국도서', icon: '🌍', desc: '해외 원서 베스트', url: 'https://www.yes24.com/Product/Category/BestSeller?categoryNumber=002', color: '#94A3B8' },
]

function openWithAffiliate(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
  if (AFFILIATE_URL) {
    const iframe = document.createElement('iframe')
    iframe.src = AFFILIATE_URL
    iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none;left:-9999px;top:-9999px;'
    document.body.appendChild(iframe)
    setTimeout(() => { try { document.body.removeChild(iframe) } catch {} }, 3000)
  }
}

export default function BestsellerView() {
  return (
    <div className="space-y-5">
      {/* 안내 배너 */}
      <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{ background: 'rgba(180,120,60,0.08)', border: '1px solid rgba(180,120,60,0.2)' }}>
        <span className="text-2xl flex-shrink-0">📚</span>
        <div>
          <p className="font-noto text-sm font-semibold" style={{ color: '#F0D5A0' }}>예스24 베스트셀러</p>
          <p className="font-noto text-xs mt-0.5" style={{ color: 'rgba(200,160,80,0.5)' }}>
            링크를 통해 구매하면 독서노트 운영에 도움이 됩니다.
          </p>
        </div>
      </div>

      {/* 카테고리 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => openWithAffiliate(cat.url)}
            className="text-left rounded-2xl p-4 transition-all duration-200 group"
            style={{ background: 'rgba(20,12,6,0.6)', border: '1px solid rgba(180,120,60,0.12)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(180,120,60,0.1)'
              e.currentTarget.style.border = '1px solid rgba(180,120,60,0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(20,12,6,0.6)'
              e.currentTarget.style.border = '1px solid rgba(180,120,60,0.12)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <p className="font-noto text-sm font-semibold" style={{ color: cat.color }}>{cat.name}</p>
            <p className="font-noto text-xs mt-1" style={{ color: 'rgba(200,160,80,0.4)' }}>{cat.desc}</p>
            <div className="flex items-center gap-1 mt-3">
              <span className="font-noto text-xs" style={{ color: 'rgba(200,160,80,0.35)' }}>예스24에서 보기</span>
              <span style={{ color: 'rgba(200,160,80,0.35)', fontSize: '11px' }}>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* 전체 베스트셀러 바로가기 */}
      <button
        onClick={() => openWithAffiliate('https://www.yes24.com/Product/Category/BestSeller?categoryNumber=001')}
        className="w-full py-4 rounded-2xl font-noto text-sm font-medium transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, rgba(196,145,90,0.2), rgba(160,103,58,0.2))',
          border: '1px solid rgba(200,140,80,0.3)',
          color: '#F0D5A0',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(196,145,90,0.3), rgba(160,103,58,0.3))'}
        onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(196,145,90,0.2), rgba(160,103,58,0.2))'}
      >
        🏆 전체 베스트셀러 보러가기 →
      </button>

      <p className="text-center font-noto text-xs" style={{ color: 'rgba(200,160,80,0.2)' }}>
        예스24 제휴 링크 · 구매 가격에는 영향 없음
      </p>
    </div>
  )
}
