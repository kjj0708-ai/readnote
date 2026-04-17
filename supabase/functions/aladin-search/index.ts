import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Yes24 상품 ID 조회 ───────────────────────────────────────────────
// Yes24 검색결과는 JS 동적 로딩 → 직접 스크래핑 불가
// Naver 도서 검색은 정적 HTML에 Yes24 링크 포함
async function getYes24GoodsId(isbn13: string): Promise<string> {
  try {
    const res = await fetch(
      `https://search.naver.com/search.naver?where=book&query=${encodeURIComponent(isbn13)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'ko-KR,ko;q=0.9',
          'Referer': 'https://search.naver.com',
        },
        redirect: 'follow'
      }
    )
    const html = await res.text()
    console.log(`[naver] 상태:${res.status} 길이:${html.length}`)

    const match = html.match(/yes24\.com\/Product\/Goods\/(\d{5,12})/)
    if (match?.[1]) {
      console.log('[naver] Yes24 ID 성공:', match[1])
      return match[1]
    }
    // yes24가 어떤 형태로 나오는지 확인
    const yes24Idx = html.toLowerCase().indexOf('yes24')
    if (yes24Idx >= 0) {
      console.log('[naver] yes24 발견 위치:', yes24Idx, '주변:', html.slice(yes24Idx - 50, yes24Idx + 200))
    } else {
      console.log('[naver] HTML에 yes24 문자열 자체가 없음')
    }
    console.log('[naver] Yes24 링크 없음')
  } catch (e) {
    console.log('[naver] 실패:', e)
  }
  return ''
}

// ─── 알라딘 API ──────────────────────────────────────────────────────
async function fetchAladinLookup(isbn: string, ttbKey: string) {
  const url = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?TTBKey=${ttbKey}&itemId=${encodeURIComponent(isbn)}&ItemIdType=ISBN13&Output=js&Version=20131101&OptResult=Toc,previewImgList`
  console.log('[aladin lookup] URL:', url)

  const res = await fetch(url)
  const text = await res.text()

  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    const match = text.match(/^[^(]+\(([\s\S]+)\)\s*;?\s*$/)
    data = match ? JSON.parse(match[1]) : null
  }

  return data
}

// ─── 메인 서버 ───────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, type } = await req.json()
    if (!query) {
      return new Response(JSON.stringify({ error: 'query 필요' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const TTB_KEY = Deno.env.get('ALADIN_TTB_KEY')
    if (!TTB_KEY) {
      return new Response(JSON.stringify({ error: 'ALADIN_TTB_KEY 없음' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ── 검색 ──
    if (type !== 'lookup') {
      const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?TTBKey=${TTB_KEY}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=10&Output=js&Version=20131101&Cover=Big`
      const res = await fetch(url)
      const text = await res.text()

      let data: any
      try { data = JSON.parse(text) }
      catch {
        const match = text.match(/^[^(]+\(([\s\S]+)\)\s*;?\s*$/)
        data = match ? JSON.parse(match[1]) : { error: '파싱 실패' }
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ── 상세 조회 + Yes24 ID ──
    const data = await fetchAladinLookup(query, TTB_KEY)
    const item = data?.item?.[0]

    if (!item) {
      return new Response(JSON.stringify(data || { error: '결과 없음' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const toc = item.subInfo?.toc || item.bookinfo?.toc || ''
    console.log('[aladin] TOC 길이:', toc.length)

    // Yes24 상품 ID 조회 (Naver 경유)
    const isbn13 = item.isbn13 || query
    if (isbn13) {
      const yes24Id = await getYes24GoodsId(isbn13)
      if (yes24Id) {
        item.yes24_id = yes24Id
        console.log('[yes24] 최종 저장 ID:', yes24Id)
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[error]', msg)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
