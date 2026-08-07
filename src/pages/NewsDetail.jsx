import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { newsAPI } from '../api/client'

function getCategoryEmoji(category) {
  const cat = String(category).toLowerCase()
  if (cat.includes('event')) return '🎓'
  if (cat.includes('scholar')) return '📚'
  if (cat.includes('elect') || cat.includes('assoc') || cat.includes('exec')) return '🗳️'
  if (cat.includes('career')) return '💼'
  if (cat.includes('commun')) return '📖'
  if (cat.includes('chapter')) return '🌍'
  return '📰'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NewsDetail() {
  const { id }    = useParams()
  const [article, setArticle] = useState(null)
  const [others, setOthers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      newsAPI.getById(id),
      newsAPI.list()
    ])
      .then(([data, list]) => {
        setArticle(data)
        setOthers(list.filter(n => String(n.id) !== String(id)).slice(0, 3))
        
        // Count categories dynamically
        const catMap = {}
        list.forEach(item => {
          const cat = item.category || 'General'
          catMap[cat] = (catMap[cat] || 0) + 1
        })
        setCategories(Object.entries(catMap).map(([name, count]) => ({ name, count })))
      })
      .catch(err => {
        console.error(err)
        setArticle(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="login-spinner" style={{ width: 40, height: 40 }} />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="page-layout">
        <div className="section">
          <div className="container text-center">
            <h2 className="section-title">Article Not Found</h2>
            <p style={{ color: 'var(--gray-700)', marginBottom: 24 }}>
              The article you are looking for does not exist or has been removed.
            </p>
            <Link to="/news" className="btn btn-primary">Back to News</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-layout">
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <span className="badge badge-green" style={{ marginBottom: 12 }}>{article.category || 'General'}</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', maxWidth: 720, margin: '0 auto 10px' }}>
            {article.title}
          </h1>
          <p style={{ opacity: 0.75 }}>{formatDate(article.created_at)}</p>
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/news">News</Link>
            <span>›</span>
            <span>{article.category || 'General'}</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="news-detail-layout">

            {/* Main article */}
            <article className="news-detail-main">
              <div className="news-detail-thumb">
                <span>{getCategoryEmoji(article.category)}</span>
              </div>
              <div className="news-detail-meta">
                <span className="badge badge-green">{article.category || 'General'}</span>
                <span className="news-card-date">{formatDate(article.created_at)}</span>
              </div>
              <div className="news-detail-body">
                <p style={{ whiteSpace: 'pre-wrap' }}>{article.body || article.excerpt}</p>
              </div>
              <div className="news-detail-footer">
                <Link to="/news" className="btn btn-outline btn-sm">← Back to News</Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <div className="sidebar-widget">
                <h4>Related Articles</h4>
                {others.map(item => (
                  <Link key={item.id} to={`/news/${item.id}`} className="sidebar-news-item">
                    <div className="sidebar-news-thumb">{getCategoryEmoji(item.category)}</div>
                    <div className="sidebar-news-info">
                      <h5>{item.title}</h5>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="sidebar-widget">
                <h4>Categories</h4>
                <div className="category-list">
                  {categories.map(cat => (
                    <Link key={cat.name} to="/news" className={`category-item${article.category === cat.name ? ' active' : ''}`}>
                      {cat.name}
                      <span className="category-count">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  )
}
