import { useRef, useState } from 'react'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif'
const MAX_MB = 5

export default function ImageUpload({ onUpload, multiple = false, label = 'Upload Image' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError]       = useState('')

  function processFiles(files) {
    setError('')
    const valid = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed (JPG, PNG, WebP, GIF).')
        return
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the ${MAX_MB}MB limit.`)
        return
      }
      valid.push({ file, url: URL.createObjectURL(file), name: file.name, size: file.size })
    }
    if (valid.length) onUpload(multiple ? valid : valid[0])
  }

  function onChange(e) {
    if (e.target.files?.length) processFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="upload-zone-icon">📁</div>
        <p className="upload-zone-label">{label}</p>
        <p className="upload-zone-hint">
          Drag & drop or <span className="upload-link">click to browse</span>
        </p>
        <p className="upload-zone-hint">JPG, PNG, WebP, GIF · Max {MAX_MB}MB{multiple ? ' · Multiple files allowed' : ''}</p>
      </div>
      {error && <p className="upload-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple={multiple}
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
