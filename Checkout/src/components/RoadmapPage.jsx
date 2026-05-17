import { useState } from 'react'
import BottomNav from './BottomNav'
import './RoadmapPage.css'
import { getRoadmap, addToWardrobe } from '../api'

const MONTH_LABELS = ['이번 달', '다음 달', '그 다음 달']

export default function RoadmapPage({ userData, roadmapData, onRoadmapUpdate, navigate }) {
  const [adding, setAdding] = useState(null)

  const loading = roadmapData === null
  const months  = roadmapData?.months ?? []

  // month 번호 기준으로 그룹핑
  const grouped = months.reduce((acc, m) => {
    const key = m.month
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})
  const monthGroups = Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b))

  const comboNow  = userData?.current_combination_count ?? 0
  const lastGroup = monthGroups[monthGroups.length - 1]?.[1] ?? []
  const lastItem  = lastGroup[lastGroup.length - 1]
  const firstGroup = monthGroups[0]?.[1] ?? []
  const firstMonthTotal = firstGroup.reduce((sum, m) => sum + (m.recommended_item?.price ?? 0), 0)

  const handleAdd = async (itemId) => {
    if (adding) return
    setAdding(itemId)
    try {
      await addToWardrobe(itemId)
      const updated = await getRoadmap()
      onRoadmapUpdate(updated)
    } catch {
      // 이미 추가된 경우 등 무시
    } finally {
      setAdding(null)
    }
  }

  if (loading) {
    return (
      <div className="rp">
        <div className="rp__loading">
          <div className="rp__spinner" />
          <p className="rp__loading-text">로드맵 생성 중...</p>
        </div>
        <BottomNav active="roadmap" onNavigate={navigate} />
      </div>
    )
  }

  return (
    <div className="rp">
      <div className="rp__scroll">

        <h1 className="rp__title">단계별 로드맵</h1>
        <p className="rp__sub">매달 하나씩 추가하세요</p>

        {monthGroups.length === 0 && (
          <p style={{ color: '#999', fontSize: 14, textAlign: 'center', marginTop: 40 }}>
            로드맵을 불러오지 못했습니다.
          </p>
        )}

        <div className="rp__steps">
          {monthGroups.map(([month, items], groupIdx) => (
            <div key={month} className="rp__month-section">
              <p className={`rp__month-label${groupIdx === 0 ? ' rp__month-label--on' : ''}`}>
                {MONTH_LABELS[groupIdx] ?? `${month}개월차`}
              </p>
              {items.map((m) => (
                <div
                  key={m.recommended_item?.id ?? `${month}-${m.reason}`}
                  className={`rp__card${groupIdx === 0 ? ' rp__card--on' : ''}`}
                >
                  <div className="rp__card-body">
                    <p className="rp__when">
                      {m.recommended_item?.brand ?? '-'}
                      {' '}<span className="rp__dot">•</span>{' '}
                      {m.recommended_item?.price?.toLocaleString()}원
                    </p>
                    <p className="rp__name">{m.recommended_item?.name}</p>
                    <p className="rp__combo">
                      " 조합 {m.projected_combination_count}가지 {groupIdx === 0 ? '가능' : '추가 시 가능'} "
                    </p>
                    {m.recommended_item?.id && (
                      <button
                        className="rp__add-btn"
                        onClick={() => handleAdd(m.recommended_item.id)}
                        disabled={adding === m.recommended_item.id}
                      >
                        {adding === m.recommended_item.id ? '추가 중...' : '옷장에 추가'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <hr className="rp__divider" />

        <div className="rp__stats">
          <div className="rp__stat">
            <p className="rp__stat-value">
              {firstMonthTotal > 0 ? `${firstMonthTotal.toLocaleString()}원` : '-'}
            </p>
            <p className="rp__stat-label">이번 달 지출</p>
          </div>
          <div className="rp__stat">
            <p className="rp__stat-value">{comboNow}가지</p>
            <p className="rp__stat-label">현재 조합</p>
          </div>
          <div className="rp__stat">
            <p className="rp__stat-value">
              {lastItem ? `${lastItem.projected_combination_count}가지` : '-'}
            </p>
            <p className="rp__stat-label">완성 시 조합</p>
          </div>
        </div>

        <button className="rp__save-btn">로드맵 저장하기</button>

      </div>

      <BottomNav active="roadmap" onNavigate={navigate} />
    </div>
  )
}
