import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
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

export default function News() {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    newsAPI.list()
      .then(data => {
        setNewsList(data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(newsList.map(n => n.category || 'General'))]

  const filtered = newsList.filter(n => {
    const matchCat = activeCategory === 'All' || (n.category || 'General') === activeCategory
    const matchSearch = !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const [featured, ...rest] = filtered

  return (
    <div className="page-layout">
      <PageHeader
        title="News & Announcements"
        subtitle="The latest updates from the BASEGA Alumni Association."
        breadcrumbs={[{ label: 'News' }]}
      />

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          {loading ? (
            <div className="text-center" style={{ padding: '80px 0' }}>
              <div className="login-spinner" style={{ width: 40, height: 40, margin: '0 auto' }} />
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured ? (
                <div className="news-featured">
                  <div className="news-featured-img">
                    <span style={{ fontSize: '4rem' }}>{getCategoryEmoji(featured.category)}</span>
                  </div>
                  <div className="news-featured-body">
                    <span className="badge badge-green">{featured.category || 'General'}</span>
                    <h2>{featured.title}</h2>
                    <p className="excerpt">{featured.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{formatDate(featured.created_at)}</span>
                      <Link to={`/news/${featured.id}`} className="btn btn-primary btn-sm">Read Full Story →</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center" style={{ padding: '40px 0', background: '#fff', borderRadius: 'var(--radius)', marginBottom: 30 }}>
                  <p style={{ color: 'var(--gray-500)', margin: 0 }}>No news articles found.</p>
                </div>
              )}

              {/* Layout */}
              <div className="news-layout">
                {/* List */}
                <div>
                  <div className="news-list">
                    {rest.map(item => (
                      <div key={item.id} className="news-list-item">
                        <div className="news-list-img">
                          <span>{getCategoryEmoji(item.category)}</span>
                        </div>
                        <div className="news-list-body">
                          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                            <span className="badge badge-green">{item.category || 'General'}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{formatDate(item.created_at)}</span>
                          </div>
                          <h3>{item.title}</h3>
                          <p>{item.excerpt}</p>
                          <Link to={`/news/${item.id}`} className="btn btn-outline btn-xs mt-8">Read More →</Link>
                        </div>
                      </div>
                    ))}
                    {rest.length === 0 && featured && (
                      <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '20px 0' }}>No other articles available.</p>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div>
                  {/* Search */}
                  <div className="sidebar-widget">
                    <h4>Search News</h4>
                    <input
                      type="text"
                      placeholder="Search articles…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Categories */}
                  <div className="sidebar-widget">
                    <h4>Categories</h4>
                    <div className="category-list">
                      {categories.map(cat => (
                        <div
                          key={cat}
                          className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                          onClick={() => setActiveCategory(cat)}
                        >
                          <span>{cat}</span>
                          <span className="category-count">
                            {cat === 'All' ? newsList.length : newsList.filter(n => (n.category || 'General') === cat).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent */}
                  <div className="sidebar-widget">
                    <h4>Recent Articles</h4>
                    {newsList.slice(0, 4).map(item => (
                      <Link key={item.id} to={`/news/${item.id}`} className="sidebar-news-item">
                        <div className="sidebar-news-thumb">{getCategoryEmoji(item.category)}</div>
                        <div className="sidebar-news-info">
                          <h5>{item.title}</h5>
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
