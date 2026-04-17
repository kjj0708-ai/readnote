import { useState, useCallback } from 'react'
import { useAutoSave } from '../../hooks/useAutoSave'
import SyncIndicator from './SyncIndicator'
import { parseToc } from '../../utils/tocParser'

function ChapterItem({ chapter, onSave, onRename, onDelete }) {
  const [fields, setFields] = useState({
    summary: chapter.summary || '',
    notes: chapter.notes || '',
    highlight: chapter.highlight || '',
  })
  const [expanded, setExpanded] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(chapter.title)

  const saveFn = useCallback(
    async (data) => {
      await onSave({ chapter_index: chapter.chapter_index, ...data })
    },
    [onSave, chapter.chapter_index]
  )

  const { syncStatus, triggerSave } = useAutoSave(saveFn, 2000)

  const handleChange = (field, value) => {
    const updated = { ...fields, [field]: value }
    setFields(updated)
    triggerSave({ chapter_index: chapter.chapter_index, title: chapter.title, ...updated })
  }

  const handleTitleSave = () => {
    if (titleInput.trim()) onRename(chapter.chapter_index, titleInput.trim())
    setEditingTitle(false)
  }

  return (
    <div className="border border-brown-100 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center px-4 py-3 hover:bg-cream-50 transition">
        {editingTitle ? (
          <input
            autoFocus
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="flex-1 font-noto text-sm text-brown-700 border-b border-amber-400 bg-transparent focus:outline-none mr-2"
          />
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 text-left font-noto font-medium text-brown-700 text-sm leading-snug pr-2"
          >
            {chapter.title}
          </button>
        )}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SyncIndicator status={syncStatus} />
          <button onClick={() => { setEditingTitle(true); setExpanded(true) }}
            className="text-brown-300 hover:text-amber-500 text-xs transition" title="제목 수정">✏️</button>
          <button onClick={() => onDelete(chapter.chapter_index)}
            className="text-brown-300 hover:text-red-400 text-xs transition" title="삭제">🗑️</button>
          <span onClick={() => setExpanded(!expanded)}
            className="text-brown-300 text-xs cursor-pointer select-none">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-cream-200 pt-3 bg-cream-50">
          {[
            { key: 'summary', label: '요약', placeholder: '이 챕터의 핵심 내용을 요약해보세요...', rows: 2, italic: false },
            { key: 'notes', label: '노트', placeholder: '생각, 질문, 아이디어를 자유롭게 기록하세요...', rows: 3, italic: false },
            { key: 'highlight', label: '인상 깊은 구절', placeholder: '기억하고 싶은 문장이나 구절을 적어두세요...', rows: 2, italic: true },
          ].map(({ key, label, placeholder, rows, italic }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-brown-500 mb-1 font-noto">{label}</label>
              <textarea
                value={fields[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-3 py-2 border border-brown-200 rounded-lg bg-white text-brown-700 font-noto text-sm placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y ${italic ? 'italic' : ''}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ChapterTab({ chapters, onSave, onAddChapter, onRenameChapter, onDeleteChapter, onBulkAdd, loading }) {
  const [mode, setMode] = useState(null) // null | 'single' | 'bulk'
  const [newTitle, setNewTitle] = useState('')
  const [bulkText, setBulkText] = useState('')

  const handleSingleAdd = () => {
    if (newTitle.trim()) {
      onAddChapter(newTitle.trim())
      setNewTitle('')
      setMode(null)
    }
  }

  const handleBulkAdd = () => {
    const parsed = parseToc(bulkText)
    if (parsed.length > 0) {
      onBulkAdd(parsed)
      setBulkText('')
      setMode(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-brown-50 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-brown-700 font-noto">
          챕터별 노트 {chapters.length > 0 && <span className="text-brown-400 font-normal text-sm">({chapters.length}개)</span>}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === 'bulk' ? null : 'bulk')}
            className="text-xs text-brown-500 hover:text-amber-600 font-noto border border-brown-200 hover:border-amber-300 px-2.5 py-1 rounded-full transition"
          >
            📋 목차 붙여넣기
          </button>
          <button
            onClick={() => setMode(mode === 'single' ? null : 'single')}
            className="text-xs text-amber-600 hover:text-amber-700 font-noto border border-amber-300 hover:border-amber-400 px-2.5 py-1 rounded-full transition"
          >
            + 챕터 추가
          </button>
        </div>
      </div>

      {/* 목차 붙여넣기 모드 */}
      {mode === 'bulk' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3 space-y-3">
          <div>
            <p className="text-sm font-medium text-brown-700 font-noto mb-1">📋 목차 한 번에 입력</p>
            <p className="text-xs text-brown-400 font-noto mb-2">
              책의 목차를 복사해서 붙여넣으세요. 줄바꿈으로 구분된 각 줄이 챕터가 됩니다.
            </p>
            <textarea
              autoFocus
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`예시:\n1장 작은 습관의 힘\n2장 정체성 기반 습관\n3장 네 가지 법칙\n4장 실행 의도`}
              rows={6}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm font-noto text-brown-700 placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkAdd}
              disabled={!bulkText.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white text-sm rounded-lg font-noto transition"
            >
              {parseToc(bulkText).length > 0 ? `${parseToc(bulkText).length}개 챕터 생성` : '챕터 생성'}
            </button>
            <button onClick={() => { setBulkText(''); setMode(null) }}
              className="px-4 py-2 text-brown-400 hover:text-brown-600 text-sm rounded-lg font-noto transition">
              취소
            </button>
          </div>
        </div>
      )}

      {/* 단일 챕터 추가 모드 */}
      {mode === 'single' && (
        <div className="flex gap-2 mb-3">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSingleAdd()}
            placeholder="챕터 제목 입력 (예: 1장 시작의 힘)"
            className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm font-noto text-brown-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button onClick={handleSingleAdd}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg font-noto transition">추가</button>
          <button onClick={() => { setNewTitle(''); setMode(null) }}
            className="px-3 py-2 text-brown-400 hover:text-brown-600 text-sm rounded-lg font-noto transition">취소</button>
        </div>
      )}

      {/* 챕터 없을 때 안내 */}
      {chapters.length === 0 && mode === null && (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-brown-100 rounded-xl">
          <div className="text-4xl mb-3 opacity-40">📑</div>
          <p className="text-brown-500 font-noto text-sm font-medium mb-1">아직 챕터가 없습니다</p>
          <p className="text-brown-300 font-noto text-xs leading-relaxed">
            책의 목차를 복사해서 <span className="text-amber-500">📋 목차 붙여넣기</span>로 한 번에 추가하거나<br />
            <span className="text-amber-500">+ 챕터 추가</span>로 직접 입력하세요
          </p>
        </div>
      )}

      {/* 챕터 목록 */}
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id || chapter.chapter_index}
          chapter={chapter}
          onSave={onSave}
          onRename={onRenameChapter}
          onDelete={onDeleteChapter}
        />
      ))}
    </div>
  )
}
