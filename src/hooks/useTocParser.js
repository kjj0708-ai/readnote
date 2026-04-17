import { useMemo } from 'react'
import { parseToc, generateDefaultChapters } from '../utils/tocParser'

/**
 * TOC 문자열을 파싱하여 챕터 배열 반환
 */
export function useTocParser(tocString) {
  const chapters = useMemo(() => {
    if (!tocString) return generateDefaultChapters(5)
    const parsed = parseToc(tocString)
    if (parsed.length === 0) return generateDefaultChapters(5)
    return parsed
  }, [tocString])

  return chapters
}
