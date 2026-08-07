import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home          from './pages/Home'
import About         from './pages/About'
import Members       from './pages/Members'
import MemberProfile from './pages/MemberProfile'
import News          from './pages/News'
import NewsDetail    from './pages/NewsDetail'
import Events        from './pages/Events'
import Gallery       from './pages/Gallery'
import Messages      from './pages/Messages'
import Contact       from './pages/Contact'
import Committees    from './pages/Committees'
import Admin         from './pages/Admin'
import UploadImages  from './pages/UploadImages'
import Payment       from './pages/Payment'
import Register      from './pages/Register'
import Nominate      from './pages/Nominate'
import AlumniOfMonth from './pages/AlumniOfMonth'
import Jubilee       from './pages/Jubilee'
import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<Layout><Home /></Layout>} />
      <Route path="/about"          element={<Layout><About /></Layout>} />
      <Route path="/members"        element={<Layout><Members /></Layout>} />
      <Route path="/members/:id"    element={<Layout><MemberProfile /></Layout>} />
      <Route path="/news"           element={<Layout><News /></Layout>} />
      <Route path="/news/:id"       element={<Layout><NewsDetail /></Layout>} />
      <Route path="/events"         element={<Layout><Events /></Layout>} />
      <Route path="/gallery"        element={<Layout><Gallery /></Layout>} />
      <Route path="/messages"       element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
      <Route path="/contact"        element={<Layout><Contact /></Layout>} />
      <Route path="/committees"     element={<Layout><Committees /></Layout>} />
      <Route path="/payment"        element={<Layout><Payment /></Layout>} />
      <Route path="/register"       element={<Layout><Register /></Layout>} />
      <Route path="/nominate"       element={<Layout><Nominate /></Layout>} />
      <Route path="/alumni-of-month" element={<Layout><AlumniOfMonth /></Layout>} />
      <Route path="/jubilee"         element={<Layout><Jubilee /></Layout>} />
      <Route path="/login"          element={<Login />} />
      <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin"          element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
      <Route path="/upload-images"  element={<ProtectedRoute><Layout><UploadImages /></Layout></ProtectedRoute>} />
    </Routes>
  )
}
