import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'
import MemberProfile from './pages/MemberProfile'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Messages from './pages/Messages'
import Contact from './pages/Contact'
import Committees from './pages/Committees'
import Admin from './pages/Admin'
import UploadImages from './pages/UploadImages'
import Payment from './pages/Payment'
import Register from './pages/Register'
import Nominate from './pages/Nominate'
import AlumniOfMonth from './pages/AlumniOfMonth'
import Jubilee from './pages/Jubilee'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function Layout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.querySelector('.route-view')
    if (!root) return undefined

    const initReveal = (el, idx = 0) => {
      if (el.classList.contains('scroll-reveal')) return
      el.classList.add('scroll-reveal')
      el.style.setProperty('--scroll-delay', `${Math.min(idx * 45, 240)}ms`)
      if (observer) {
        observer.observe(el)
      } else {
        el.classList.add('is-visible')
      }
    }

    let observer = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      }, { threshold: 0.08, rootMargin: '0px 0px 50px 0px' })
    }

    const selector = '.section, .profile-card, .member-card, .news-card, .news-home-card, .events-card, .purpose-card, .value-card, .leader-card, .staff-card, .contact-info-card'

    // Initial batch
    const initialElements = root.querySelectorAll(selector)
    initialElements.forEach((el, idx) => initReveal(el, idx))

    // Watch for dynamically rendered items (e.g. after API fetch in MemberProfile, Events, etc.)
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return
          if (node.matches && node.matches(selector)) {
            initReveal(node, 0)
          }
          if (node.querySelectorAll) {
            node.querySelectorAll(selector).forEach((el, idx) => initReveal(el, idx))
          }
        })
      })
    })

    mutationObserver.observe(root, { childList: true, subtree: true })

    return () => {
      if (observer) observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  return (
    <>
      <Navbar />
      <div key={pathname} className="route-view">
        {children}
      </div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/members" element={<Layout><Members /></Layout>} />
      <Route path="/members/:id" element={<Layout><MemberProfile /></Layout>} />
      <Route path="/news" element={<Layout><News /></Layout>} />
      <Route path="/news/:id" element={<Layout><NewsDetail /></Layout>} />
      <Route path="/events" element={<Layout><Events /></Layout>} />
      <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
      <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/committees" element={<Layout><Committees /></Layout>} />
      <Route path="/payment" element={<Layout><Payment /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/nominate" element={<Layout><Nominate /></Layout>} />
      <Route path="/alumni-of-month" element={<Layout><AlumniOfMonth /></Layout>} />
      <Route path="/jubilee" element={<Layout><Jubilee /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
      <Route path="/upload-images" element={<ProtectedRoute><Layout><UploadImages /></Layout></ProtectedRoute>} />
    </Routes>
  )
}
