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
  dandy:   'amekaji',
  sports:  'sports',
  vintage: 'vintage',
  street:  'cityboy',
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
  military:  'daily',
}

const BUDGET_MAP = {
  '5만원 이하':  'under_5',
  '5~10만원':   '5_to_10',
  '10~15만원':  '10_to_20',
  '15~20만원':  '10_to_20',
  '20만원 이상': 'over_20',
}

// 한국어 아이템명 → { cat, key }
const WARDROBE_ITEM_MAP = {
  // 상의 → top
  '베이직 셔츠': { cat: 'top',    key: 'basic_shirt' },
  '니트':        { cat: 'top',    key: 'knit' },
  '티셔츠':      { cat: 'top',    key: 'white_black_tee' },
  '긴팔티':      { cat: 'top',    key: 'long_sleeve_tee' },
  '맨투맨':      { cat: 'top',    key: 'sweatshirt' },
  '후드티':      { cat: 'top',    key: 'hoodie' },
  '반팔셔츠':    { cat: 'top',    key: 'short_sleeve_shirt' },
  '린넨셔츠':    { cat: 'top',    key: 'linen_shirt' },
  '폴로셔츠':    { cat: 'top',    key: 'polo_shirt' },
  // 하의 → bottom
  '슬랙스':      { cat: 'bottom', key: 'black_slacks' },
  '청바지':      { cat: 'bottom', key: 'wide_denim' },
  '조거팬츠':    { cat: 'bottom', key: 'jogger_pants' },
  '반바지':      { cat: 'bottom', key: 'shorts' },
  '면바지':      { cat: 'bottom', key: 'cotton_pants' },
  '와이드팬츠':  { cat: 'bottom', key: 'wide_pants' },
  '카고팬츠':    { cat: 'bottom', key: 'cargo_pants' },
  // 아우터 → outer
  '코트':        { cat: 'outer',  key: 'coat' },
  '트렌치코트':  { cat: 'outer',  key: 'trench_coat' },
  '패딩':        { cat: 'outer',  key: 'padding' },
  '자켓':        { cat: 'outer',  key: 'coach_jacket' },
  '블레이저':    { cat: 'outer',  key: 'blazer' },
  '가디건':      { cat: 'outer',  key: 'cardigan' },
  '후드집업':    { cat: 'outer',  key: 'hoodie_zip_up' },
  '점퍼':        { cat: 'outer',  key: 'jumper' },
  '바람막이':    { cat: 'outer',  key: 'windbreaker' },
}

// ── payload 빌더 ──────────────────────────────────────────

export function buildOnboardingPayload({ style, fit, lifestyle, wardrobe, budget }) {
  const current_wardrobe = { top: [], bottom: [], outer: [], shoes: [] }
  for (const item of wardrobe) {
    const mapped = WARDROBE_ITEM_MAP[item]
    if (mapped) current_wardrobe[mapped.cat].push(mapped.key)
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
