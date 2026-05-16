import { useState } from 'react'
import Onboarding from './components/Onboarding'
import MainPage from './components/MainPage'
import RoadmapPage from './components/RoadmapPage'

export default function App() {
  const [page, setPage] = useState('onboarding')
  const [userData, setUserData] = useState(null)

  const handleComplete = (data) => {
    setUserData(data)
    setPage('main')
  }

  const navigate = (target) => {
    if (target === '진단') {
      setUserData(null)
      setPage('onboarding')
    } else if (target === '메인페이지') {
      setPage('main')
    } else if (target === '로드맵') {
      setPage('roadmap')
    } else if (target === '마이페이지') {
      setPage('mypage')
    }
  }

  return (
    <>
      {page === 'onboarding' && <Onboarding onComplete={handleComplete} />}
      {page === 'main'      && <MainPage userData={userData} navigate={navigate} />}
      {page === 'roadmap'   && <RoadmapPage navigate={navigate} />}
    </>
  )
}
