import { useState } from 'react'
import './Onboarding.css'

const PRIMARY = '#8C1515'

const STYLES = [
  { id: 'minimal', label: '미니멀', img: '/images/styles/미니멀.png' },
  { id: 'casual',  label: '캐주얼', img: '/images/styles/캐주얼.png' },
  { id: 'dandy',   label: '댄디',   img: '/images/styles/댄디.png' },
  { id: 'sports',  label: '스포츠', img: '/images/styles/스포츠.png' },
  { id: 'vintage', label: '빈티지', img: '/images/styles/빈티지.png' },
  { id: 'street',  label: '스트릿', img: '/images/styles/스트릿.png' },
]

const FITS = [
  {
    id: 'slim',
    label: '슬림핏',
    sub: 'SLIM FIT',
    desc: '몸에 자연스럽게 밀착되는 핏으로\n슬림하고 단정한 실루엣',
    img: '/images/fits/Slimfit.png',
  },
  {
    id: 'regular',
    label: '레귤러핏',
    sub: 'REGULAR FIT',
    desc: '몸에 적당히 여유가 있는 기본 핏으로\n가장 베이직한 실루엣',
    img: '/images/fits/Regularfit.png',
  },
  {
    id: 'over',
    label: '오버핏',
    sub: 'OVER FIT',
    desc: '몸에 넉넉하게 떨어지는 핏으로\n자연스럽고 캐주얼한 실루엣',
    img: '/images/fits/Overfit.png',
  },
]

const LIFESTYLES = [
  { id: 'campus',    label: '캠퍼스 라이프', desc: '강의, 스터디, 과제 발표',       img: '/images/lifestyles/캠퍼스.jpg' },
  { id: 'office',    label: '직장인',        desc: '출퇴근, 미팅, 업무 환경',       img: '/images/lifestyles/직장.jpg' },
  { id: 'freelance', label: '자유직',        desc: '재택, 카페, 자유로운 일상',     img: '/images/lifestyles/자유직.jpg' },
  { id: 'military',  label: '전역 후',       desc: '사회복귀, 새출발, 새 스타일',   img: '/images/lifestyles/전역후.jpg' },
]

const WARDROBE = {
  '아우터': ['코트', '트렌치코트', '패딩', '자켓', '블레이저', '가디건', '후드집업', '점퍼', '바람막이'],
  '상의':   ['베이직 셔츠', '니트', '티셔츠', '긴팔티', '맨투맨', '후드티', '반팔셔츠', '린넨셔츠', '폴로셔츠'],
  '하의':   ['슬랙스', '청바지', '조거팬츠', '반바지', '면바지', '와이드팬츠', '카고팬츠'],
}

const BUDGETS = ['5만원 이하', '5~10만원', '10~15만원', '15~20만원', '20만원 이상']

const TOTAL = 5

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [selStyles, setSelStyles] = useState([])
  const [selFit, setSelFit] = useState(null)
  const [selLifestyle, setSelLifestyle] = useState(null)
  const [selWardrobe, setSelWardrobe] = useState([])
  const [selBudget, setSelBudget] = useState(null)

  const toggleStyle = id =>
    setSelStyles(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id])

  const toggleWardrobe = item =>
    setSelWardrobe(p => p.includes(item) ? p.filter(s => s !== item) : [...p, item])

  const canNext =
    (step === 1 && selStyles.length > 0) ||
    (step === 2 && selFit !== null) ||
    (step === 3 && selLifestyle !== null) ||
    (step === 4 && selWardrobe.length > 0) ||
    (step === 5 && selBudget !== null)

  const next = () => { if (step < TOTAL) setStep(s => s + 1) }
  const back = () => { if (step > 1) setStep(s => s - 1) }

  return (
    <div className="ob">
      <div className="ob__nav">
        <div className="ob__back-slot">
          {step > 1 && (
            <button className="ob__back" onClick={back} aria-label="뒤로가기">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <div className="ob__progress">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div
              key={i}
              className={`ob__pill${i + 1 === step ? ' ob__pill--on' : i + 1 < step ? ' ob__pill--past' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="ob__scroll">
        {step === 1 && <StyleStep selected={selStyles} toggle={toggleStyle} />}
        {step === 2 && <FitStep selected={selFit} onSelect={setSelFit} />}
        {step === 3 && <LifestyleStep selected={selLifestyle} onSelect={setSelLifestyle} />}
        {step === 4 && <WardrobeStep selected={selWardrobe} onToggle={toggleWardrobe} />}
        {step === 5 && <BudgetStep selected={selBudget} onSelect={setSelBudget} />}
      </div>

      <div className="ob__footer">
        <button
          className="ob__btn"
          onClick={next}
          disabled={!canNext}
          style={{ background: canNext ? PRIMARY : '#C8A8A8' }}
        >
          {step === TOTAL ? 'Start !' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

function StyleStep({ selected, toggle }) {
  return (
    <div className="step">
      <h1 className="step__h1">스타일 고르기</h1>
      <p className="step__sub">Q. 1/5 어떤 스타일이 끌려요?</p>
      <div className="sg">
        {STYLES.map(s => (
          <button
            key={s.id}
            className={`sg__card${selected.includes(s.id) ? ' sg__card--on' : ''}`}
            onClick={() => toggle(s.id)}
          >
            <div
              className="sg__img"
              style={{
                backgroundImage: `url(${s.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <span className="sg__lbl">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FitStep({ selected, onSelect }) {
  return (
    <div className="step">
      <h1 className="step__h1">핏 선호도</h1>
      <p className="step__sub">Q. 2/5 어떤 핏을 선호해요?</p>
      <div className="fl">
        {FITS.map(f => (
          <button key={f.id} className="fl__row" onClick={() => onSelect(f.id)}>
            <div className="fl__fig">
              <div className={`fl__fig-inner${selected === f.id ? ' fl__fig-inner--on' : ''}`}>
                <img src={f.img} alt={f.label} className="fl__fig-img" />
              </div>
            </div>
            <div className="fl__info">
              <div className={`fl__chip${selected === f.id ? ' fl__chip--on' : ''}`}>
                {f.label} <span className="fl__sub">({f.sub})</span>
              </div>
              <div className={`fl__box${selected === f.id ? ' fl__box--on' : ''}`}>
                {f.desc.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function LifestyleStep({ selected, onSelect }) {
  return (
    <div className="step">
      <h1 className="step__h1">나의<br />라이프스타일은?</h1>
      <p className="step__sub">Q. 3/5 자신의 라이프스타일을 골라주세요</p>
      <div className="sg">
        {LIFESTYLES.map(l => (
          <button
            key={l.id}
            className={`sg__card${selected === l.id ? ' sg__card--on' : ''}`}
            onClick={() => onSelect(l.id)}
          >
            <div
              className="sg__img"
              style={{
                backgroundImage: `url(${l.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <span className="sg__lbl">{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function WardrobeStep({ selected, onToggle }) {
  const [activeTab, setActiveTab] = useState('상의')
  const items = WARDROBE[activeTab]

  return (
    <div className="step">
      <h1 className="step__h1">지금 가지고<br />있는 옷은?</h1>
      <p className="step__sub">Q. 4/5 지금 옷장에 있는 옷을 모두 골라주세요</p>
      <div className="wt">
        {Object.keys(WARDROBE).map(tab => (
          <button
            key={tab}
            className={`wt__tab${activeTab === tab ? ' wt__tab--on' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="wi">
        {items.map(item => (
          <button
            key={item}
            className={`wi__pill${selected.includes(item) ? ' wi__pill--on' : ''}`}
            onClick={() => onToggle(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function BudgetStep({ selected, onSelect }) {
  return (
    <div className="step">
      <h1 className="step__h1">월 예산은?</h1>
      <p className="step__sub">Q. 5/5 첫 옷장을 위한 월 예산을 알려주세요</p>
      <div className="bg">
        {BUDGETS.map(b => (
          <button
            key={b}
            className={`bg__btn${selected === b ? ' bg__btn--on' : ''}`}
            onClick={() => onSelect(b)}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  )
}
