import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'

const CATEGORIES = ['Profile Photo', 'News', 'Gallery', 'Events', 'School Life', 'Other']

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadImages() {
  const [images,   setImages]   = useState([])
  const [category, setCategory] = useState('Gallery')
  const [filter,   setFilter]   = useState('All')

  function handleUpload(items) {
    const list = Array.isArray(items) ? items : [items]
    const stamped = list.map(item => ({
      ...item,
      id:       Date.now() + Math.random(),
      category,
      uploaded: new Date().toLocaleString(),
    }))
    setImages(prev => [...stamped, ...prev])
  }

  function removeImage(id) {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.url)
      return prev.filter(i => i.id !== id)
    })
  }

  const displayed = filter === 'All' ? images : images.filter(i => i.category === filter)

  return (
    <div className="page-layout">
      <PageHeader
        title="Image Manager"
        subtitle="Upload and manage images used across the BASEGA website."
        breadcrumbs={[{ label: 'Image Manager' }]}
      />

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          <div className="upload-page-grid">

            {/* Upload Panel */}
            <div className="upload-panel">
              <div className="upload-panel-card">
                <h3 className="upload-panel-title">Upload New Images</h3>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <ImageUpload
                  label="Upload Images"
                  multiple
                  onUpload={handleUpload}
                />

                <div className="upload-tips">
                  <p className="upload-tips-title">Tips</p>
                  <ul>
                    <li>Use <strong>Profile Photo</strong> for member avatars</li>
                    <li>Use <strong>News</strong> for article header images</li>
                    <li>Use <strong>Gallery</strong> for event photo albums</li>
                    <li>Recommended size: 1200×800px or larger</li>
                    <li>Maximum file size: 5MB per image</li>
                  </ul>
                </div>
              </div>

              {/* Stats */}
              <div className="upload-stats-card">
                <h4>Upload Stats</h4>
                <div className="upload-stat-row">
                  <span>Total Images</span>
                  <strong>{images.length}</strong>
                </div>
                {CATEGORIES.map(c => {
                  const count = images.filter(i => i.category === c).length
                  return count > 0 ? (
                    <div key={c} className="upload-stat-row">
                      <span>{c}</span>
                      <strong>{count}</strong>
                    </div>
                  ) : null
                })}
              </div>
            </div>

            {/* Gallery Panel */}
            <div className="upload-gallery-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  Uploaded Images {displayed.length > 0 && <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>({displayed.length})</span>}
                </h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['All', ...CATEGORIES].map(c => (
                    <button
                      key={c}
                      className={`gal-btn ${filter === c ? 'active' : ''}`}
                      style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                      onClick={() => setFilter(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {displayed.length === 0 ? (
                <div className="upload-empty">
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🖼️</div>
                  <p>{images.length === 0 ? 'No images uploaded yet. Use the panel on the left to get started.' : 'No images in this category.'}</p>
                </div>
              ) : (
                <div className="upload-img-grid">
                  {displayed.map(img => (
                    <div key={img.id} className="upload-img-item">
                      <div className="upload-img-preview">
                        <img src={img.url} alt={img.name} />
                        <div className="upload-img-overlay">
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => removeImage(img.id)}
                          >
                            🗑 Remove
                          </button>
                          <a
                            href={img.url}
                            download={img.name}
                            className="btn btn-white btn-xs"
                          >
                            ↓ Save
                          </a>
                        </div>
                      </div>
                      <div className="upload-img-info">
                        <div className="upload-img-name" title={img.name}>{img.name}</div>
                        <div className="upload-img-meta">
                          <span className="badge badge-green">{img.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{formatSize(img.size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
