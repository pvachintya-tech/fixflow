import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GridBackground from './components/ui/GridBackground'
import Navbar from './components/Navbar'
import HeroSection from './components/Hero/HeroSection'
import ScrollStorySection from './components/ScrollStory/ScrollStorySection'
import DemoPage from './pages/DemoPage'

function LandingPage() {
  return (
    <main className="relative">
      <GridBackground />
      <HeroSection />
      <ScrollStorySection />
    </main>
  )
}

function AdminPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-strong rounded-2xl p-12 text-center max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Command Center</h1>
        <p className="text-slate-400">Coming soon. The admin dashboard is under development.</p>
      </div>
    </div>
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
          <Route path="/admin" element={<AdminPlaceholder />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
