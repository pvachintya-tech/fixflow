import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GridBackground from './components/ui/GridBackground'
import Navbar from './components/Navbar'
import HeroSection from './components/Hero/HeroSection'
import ScrollStorySection from './components/ScrollStory/ScrollStorySection'
import DemoPage from './pages/DemoPage'
import AdminPage from './pages/AdminPage'

function LandingPage() {
  return (
    <main className="relative">
      <GridBackground />
      <HeroSection />
      <ScrollStorySection />
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-950 min-h-screen grid-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
