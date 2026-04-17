/**
 * 알라딘 API에서 반환된 목차(TOC) 문자열을 파싱하여
 * 챕터 배열로 변환합니다.
 *
 * 입력 예시:
 *   "1장 작은 변화가 만드는 놀라운 결과\n2장 습관이 정체성을 만드는 방법\n3장 네 가지 법칙"
 *
 * 출력 예시:
 *   [
 *     { index: 0, title: "1장 작은 변화가 만드는 놀라운 결과" },
 *     { index: 1, title: "2장 습관이 정체성을 만드는 방법" },
 *     { index: 2, title: "3장 네 가지 법칙" },
 *   ]
 */
export function parseToc(tocString) {
  if (!tocString || typeof tocString !== 'string') return []

  const lines = tocString
    .split(/\n|<br\s*\/?>/gi)
    .map((line) => line.replace(/<[^>]+>/g, '').trim())
    .filter((line) => line.length > 2)

  return lines.map((title, index) => ({
    index,
    title,
  }))
}

/**
 * TOC가 없을 때 기본 챕터 구조를 생성합니다.
 */
export function generateDefaultChapters(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    title: `${i + 1}장`,
  }))
}
