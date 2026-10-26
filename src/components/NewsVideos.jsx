function getSafeVideoUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

function getVideoEmbedUrl(url) {
  if (!url) return null

  const host = url.hostname.toLowerCase()
  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
  }
  if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
    const id = url.searchParams.get('v') ||
      url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
  }
  if (host === 'vimeo.com' || host === 'www.vimeo.com') {
    const id = url.pathname.match(/^\/(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return null
}

function isDirectVideo(url) {
  return url && /\.(?:mp4|webm|ogg)$/i.test(url.pathname)
}

export default function NewsVideos({ article }) {
  const videoUrls = Array.isArray(article.videos)
    ? [...article.videos, article.video_url_1, article.video_url_2]
    : [article.video_url_1, article.video_url_2]
  const videos = [...new Set(videoUrls)]
    .map(getSafeVideoUrl)
    .filter(Boolean)
  if (!videos.length) return null

  return (
    <section className="news-videos" aria-label="Announcement videos">
      <h2>Videos</h2>
      <div className="news-videos-grid">
        {videos.map((videoUrl, index) => {
          const embedUrl = getVideoEmbedUrl(videoUrl)
          return (
            <div className="news-video" key={`${videoUrl.href}-${index}`}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`Announcement video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : isDirectVideo(videoUrl) ? (
                <video controls preload="metadata">
                  <source src={videoUrl.href} />
                  Your browser does not support the video element.
                </video>
              ) : (
                <a href={videoUrl.href} target="_blank" rel="noopener noreferrer">
                  Watch video {index + 1}
                </a>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
