import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Videos() {
  const { gallery } = useContext(AppContext);

  return (
    <div className="videos-page animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="videos-header text-center">
        <span className="section-tag">SERMON ARCHIVES</span>
        <h2>Ministry Video Sermons</h2>
        <p className="lead-desc">Watch open-air crusades highlights, pastor teachings, salvation testimonies, and devotional videos on demand.</p>
      </section>

      {/* Videos Grid */}
      <section className="videos-grid-section">
        {gallery.videos.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p>No video archives uploaded yet. Log in as admin to add videos.</p>
          </div>
        ) : (
          <div className="grid-2 gallery-videos-grid">
            {gallery.videos.map(video => (
              <div key={video._id || video.id} className="card video-gallery-item text-left">
                <div className="video-iframe-wrapper">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-details font-sans">
                  <span className="badge badge-gold">{video.category}</span>
                  <h4>{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .videos-header {
          margin-bottom: 3rem;
        }
        .lead-desc {
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0.5rem auto 0;
        }
        .video-gallery-item {
          padding: 1.5rem;
        }
        .video-iframe-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }
        .video-iframe-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .video-details {
          margin-top: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .video-details h4 {
          font-size: 1.15rem;
          color: var(--primary-blue);
          margin: 0;
        }
      `}</style>

    </div>
  );
}
