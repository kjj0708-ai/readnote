/**
 * Yes24 도서 링크 생성 (어필리에이트 쿠키 방식)
 *
 * yes24_id 있음 → 직접 상품 페이지
 * yes24_id 없음 → ISBN 검색 페이지 (결과 1건)
 *
 * .env.local: VITE_YES24_AFFILIATE_URL=https://bitl.bz/bNxAdf
 */

const AFFILIATE_URL = import.meta.env.VITE_YES24_AFFILIATE_URL || ''

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function getYes24Url(book) {
  const isbn = book.isbn13 || book.isbn
  const goodsId = book.yes24_id
  const mobile = isMobile()

  if (goodsId) {
    return mobile
      ? `https://m.yes24.com/Goods/Detail/${goodsId}`
      : `https://www.yes24.com/Product/Goods/${goodsId}`
  }
  if (isbn) {
    return mobile
      ? `https://m.yes24.com/Search/Result?query=${encodeURIComponent(isbn)}&domain=BOOK`
      : `https://www.yes24.com/Product/Search?query=${encodeURIComponent(isbn)}&domain=BOOK`
  }
  return mobile
    ? `https://m.yes24.com/Search/Result?query=${encodeURIComponent(book.title)}&domain=BOOK`
    : `https://www.yes24.com/Product/Search?query=${encodeURIComponent(book.title)}&domain=BOOK`
}

/**
 * 어필리에이트 쿠키 심기 + Yes24 이동
 */
export function openYes24WithAffiliate(book) {
  const targetUrl = getYes24Url(book)

  // 1) 책 페이지 바로 열기
  window.open(targetUrl, '_blank', 'noopener,noreferrer')

  // 2) 어필리에이트 쿠키를 숨겨진 iframe으로 심기
  if (AFFILIATE_URL) {
    const iframe = document.createElement('iframe')
    iframe.src = AFFILIATE_URL
    iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none;left:-9999px;top:-9999px;'
    document.body.appendChild(iframe)
    setTimeout(() => {
      try { document.body.removeChild(iframe) } catch {}
    }, 3000)
  }
}
