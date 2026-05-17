import BottomNav from './BottomNav'
import './MainPage.css'

export default function MainPage({ userData, recData, navigate }) {
  const { style, fit, lifestyle, budget, current_combination_count } = userData ?? {}

  const recLoading = recData === null
  const comboNow   = current_combination_count ?? 0
  const comboAfter = recData?.after_combination_count ?? comboNow
  const progress   = comboAfter > 0 ? Math.round((comboNow / comboAfter) * 100) : 0

  return (
    <div className="mp">
      <div className="mp__scroll">

        {/* 헤더 */}
        <div className="mp__header">
          <div>
            <p className="mp__greeting">안녕하세요</p>
            <p className="mp__greeting mp__greeting--bold">옷 골라드릴게요!</p>
          </div>
          <button className="mp__bell" aria-label="알림">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="mp__bell-dot" />
          </button>
        </div>

        {/* 검정 위젯 */}
        <div className="mp__widget">
          <h2 className="mp__widget-title">{style?.label}</h2>
          <p className="mp__widget-row">{lifestyle?.label} • 월 {budget}</p>
          <p className="mp__widget-row">{fit?.label} 추천</p>
        </div>

        {/* 퍼스널 추천 */}
        <p className="mp__section-title">퍼스널 추천 아이템</p>

        {recLoading && <div className="mp__product-card mp__product-card--loading" />}

        {!recLoading && !recData && (
          <div className="mp__product-card">
            <p style={{ color: '#999', fontSize: 14, margin: 'auto' }}>추천을 불러오지 못했습니다.</p>
          </div>
        )}

        {!recLoading && recData && (
          <div className="mp__product-card">
            <div
              className="mp__product-img"
              style={recData.image_url ? { backgroundImage: `url(${recData.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {!recData.image_url && (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
                </svg>
              )}
            </div>
            <div className="mp__product-info">
              <p className="mp__product-name">{recData.item_name}</p>
              <p className="mp__product-price">{recData.price?.toLocaleString()}원</p>
              <p className="mp__product-brand">{recData.brand}</p>
              <p className="mp__product-desc">{recData.reason}</p>
            </div>
          </div>
        )}

        <button
          className="mp__shop-btn"
          onClick={() => recData?.product_url && window.open(recData.product_url, '_blank')}
          disabled={!recData?.product_url}
        >
          쇼핑몰에서 보기
        </button>

        {/* 로드맵 진행 */}
        <div className="mp__roadmap-card">
          <p className="mp__roadmap-label">
            로드맵 진행 중 <span className="mp__roadmap-dot">•</span> {progress}%
          </p>
          <div className="mp__roadmap-bar">
            <div className="mp__roadmap-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

      </div>

      <BottomNav active="main" onNavigate={navigate} />
    </div>
  )
}
