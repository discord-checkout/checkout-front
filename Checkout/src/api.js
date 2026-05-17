const BASE_URL = '/api'

export function getUserId() {
  let id = localStorage.getItem('user_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('user_id', id)
  }
  return id
}

export function resetUserId() {
  const id = crypto.randomUUID()
  localStorage.setItem('user_id', id)
  return id
}

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-User-ID': getUserId(),
  }
}

// ── 매핑 테이블 ────────────────────────────────────────────

const STYLE_MAP = {
  minimal: 'minimal',
  casual:  'casual',
  dandy:   'dandy',
  sports:  'sports',
  vintage: 'vintage',
  street:  'street',
}

const FIT_MAP = {
  slim:    'slim',
  regular: 'regular',
  over:    'overfit',
}

const LIFESTYLE_MAP = {
  campus:    'campus',
  office:    'office',
  freelance: 'freelance',
  daily:     'daily',
}

const BUDGET_MAP = {
  '5만원 이하':  'under_5',
  '5~10만원':   '5_to_10',
  '10~15만원':  '10_to_15',
  '15~20만원':  '15_to_20',
  '20만원 이상': 'over_20',
}

// 한국어 아이템명 → 카테고리 (API가 한국어 그대로 받음)
const WARDROBE_ITEM_MAP = {
  // 상의 → top
  '베이직 셔츠': 'top',
  '니트':        'top',
  '티셔츠':      'top',
  '긴팔티':      'top',
  '맨투맨':      'top',
  '후드티':      'top',
  '반팔셔츠':    'top',
  '린넨셔츠':    'top',
  '폴로셔츠':    'top',
  // 하의 → bottom
  '슬랙스':      'bottom',
  '청바지':      'bottom',
  '조거팬츠':    'bottom',
  '반바지':      'bottom',
  '면바지':      'bottom',
  '와이드팬츠':  'bottom',
  '카고팬츠':    'bottom',
  // 아우터 → outer
  '코트':        'outer',
  '트렌치코트':  'outer',
  '패딩':        'outer',
  '자켓':        'outer',
  '블레이저':    'outer',
  '가디건':      'outer',
  '후드집업':    'outer',
  '점퍼':        'outer',
  '바람막이':    'outer',
}

// ── payload 빌더 ──────────────────────────────────────────

export function buildOnboardingPayload({ style, fit, lifestyle, wardrobe, budget }) {
  const current_wardrobe = { top: [], bottom: [], outer: [] }
  for (const item of wardrobe) {
    const cat = WARDROBE_ITEM_MAP[item]
    if (cat) current_wardrobe[cat].push(item)
  }
  return {
    style_mood:        STYLE_MAP[style.id]     ?? style.id,
    fit_preference:    FIT_MAP[fit.id]         ?? fit.id,
    lifestyle:         LIFESTYLE_MAP[lifestyle.id] ?? lifestyle.id,
    budget_range:      BUDGET_MAP[budget]      ?? 'under_5',
    current_wardrobe,
  }
}

// ── API 함수 ──────────────────────────────────────────────

export async function diagnoseOnboarding(payload) {
  const res = await fetch(`${BASE_URL}/onboarding/diagnose`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error('onboarding failed')
    err.status = res.status
    err.body = body
    throw err
  }
  return res.json()
}

export async function getFirstItemRecommendation() {
  const res = await fetch(`${BASE_URL}/recommendations/first-item`, {
    headers: apiHeaders(),
  })
  if (!res.ok) throw new Error('recommendation fetch failed')
  return res.json()
}

export async function getRoadmap() {
  const res = await fetch(`${BASE_URL}/wardrobe/roadmap`, {
    headers: apiHeaders(),
  })
  if (!res.ok) throw new Error('roadmap fetch failed')
  return res.json()
}

export async function addToWardrobe(itemId) {
  const res = await fetch(`${BASE_URL}/wardrobe/add`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ item_id: itemId }),
  })
  if (!res.ok) throw new Error('wardrobe add failed')
  return res.json()
}

export async function getWardrobe() {
  const res = await fetch(`${BASE_URL}/wardrobe`, {
    headers: apiHeaders(),
  })
  if (!res.ok) throw new Error('wardrobe fetch failed')
  return res.json()
}
