import { useState } from 'react'
import Onboarding from './components/Onboarding'
import MainPage from './components/MainPage'
import RoadmapPage from './components/RoadmapPage'

// 접속할 때마다 초기화 (개발 환경)
localStorage.clear()

export default function App() {
  const [page, setPage] = useState('onboarding')
  const [userData, setUserData] = useState(null)
  const [recData, setRecData] = useState(null)
  const [roadmapData, setRoadmapData] = useState(null)
  const [prevPage, setPrevPage] = useState(null)

  const handleComplete = (data, recData, roadmapData) => {
    setUserData(data)
    setRecData(recData ?? null)
    setRoadmapData(roadmapData ?? null)
    setPrevPage(null)
    setPage('main')
  }

  const navigate = (target) => {
    if (target === '진단') {
      setPrevPage(page)
      setPage('onboarding')
    } else if (target === '메인페이지') {
      setPage('main')
    } else if (target === '로드맵') {
      setPage('roadmap')
    }
  }

  const handleOnboardingBack = prevPage
    ? () => { setPage(prevPage); setPrevPage(null) }
    : null

  return (
    <>
      {page === 'onboarding' && (
        <Onboarding onComplete={handleComplete} onBack={handleOnboardingBack} />
      )}
      {page === 'main' && (
        <MainPage userData={userData} recData={recData} navigate={navigate} />
      )}
      {page === 'roadmap' && (
        <RoadmapPage userData={userData} roadmapData={roadmapData} navigate={navigate} onRoadmapUpdate={setRoadmapData} />
      )}
    </>
  )
}
