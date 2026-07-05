import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Media() {
  const { gallery, sermons } = useContext(AppContext);
  const [activeMediaTab, setActiveMediaTab] = useState('Photos');
  const [photoCategory, setPhotoCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Filter photos based on category
  const filteredPhotos = gallery.photos.filter(photo => 
    photoCategory === 'All' || photo.category === photoCategory
  );

  // Photo categories
  const categories = ['All', 'Outreach', 'Community', 'Crusades', 'Trips'];

  const newsletters = [
    { id: 'nl-1', title: "June 2026 Prayer Letter", date: "June 01, 2026", size: "1.2 MB", desc: "Outlining the opening of blind eyes in Kakamega and our upcoming well-drilling itinerary." },
    { id: 'nl-2', title: "May 2026 Monthly Harvest Report", date: "May 01, 2026", size: "2.4 MB", desc: "Detailed statistical updates on salvations, children fed, and sound equipment fundraising." },
    { id: 'nl-3', title: "April 2026 Ministry Newsletter", date: "April 01, 2026", size: "1.8 MB", desc: "Personal updates from the Sterling family, and Easter crusade reports." }
  ];

  const studyGuides = [
    { id: 'sg-1', title: "Foundations of Faith (10-Week Study)", author: "Daniel Sterling", fileType: "PDF", size: "4.5 MB" },
    { id: 'sg-2', title: "The Authority of the Believer", author: "Daniel Sterling", fileType: "PDF", size: "2.1 MB" }
  ];

  return (
    <div className="media-page animate-fade-in">
      
      {/* Page Header */}
      <section className="media-header text-center">
        <span className="section-tag">RESOURCES & GALLERY</span>
        <h2>Media & Sermons</h2>
        <p className="lead-desc">Watch video highlights, listen to teachings, download Bible study guides, and browse photos.</p>
      </section>

      {/* Media Type Navigation Tabs */}
      <section className="media-tabs-section">
        <div className="tab-container">
          {['Photos', 'Videos', 'Sermons & Audio', 'Resources & Newsletters'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeMediaTab === tab ? 'active' : ''}`}
              onClick={() => setActiveMediaTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* 1. Photos Tab */}
      {activeMediaTab === 'Photos' && (
        <section className="photos-gallery-tab animate-fade-in">
          {/* Photo Category Selector */}
          <div className="photo-category-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${photoCategory === cat ? 'active' : ''}`}
                onClick={() => setPhotoCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid-4 gallery-photos-grid">
            {filteredPhotos.map(photo => (
              <div 
                key={photo.id} 
                className="gallery-photo-item card" 
                onClick={() => setLightboxImage(photo)}
              >
                <img src={photo.url} alt={photo.title} className="gallery-thumbnail" />
                <div className="photo-info-overlay">
                  <h4>{photo.title}</h4>
                  <span className="photo-cat-badge">{photo.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Videos Tab */}
      {activeMediaTab === 'Videos' && (
        <section className="videos-gallery-tab animate-fade-in">
          <div className="grid-2 gallery-videos-grid">
            {gallery.videos.map(video => (
              <div key={video.id} className="card video-gallery-item text-left">
                <div className="video-iframe-wrapper">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-details">
                  <span className="badge badge-gold">{video.category}</span>
                  <h4>{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Sermons & Audio Tab */}
      {activeMediaTab === 'Sermons & Audio' && (
        <section className="sermons-tab animate-fade-in">
          <div className="sermons-list">
            {sermons.map(sermon => (
              <div key={sermon.id} className="card sermon-item text-left">
                <div className="sermon-header-row">
                  <div>
                    <span className="sermon-meta-info">{sermon.date} • {sermon.duration}</span>
                    <h4>{sermon.title}</h4>
                  </div>
                  <span className={`badge ${sermon.type === 'Audio' ? 'badge-info' : 'badge-gold'}`}>
                    {sermon.type}
                  </span>
                </div>
                
                <p className="sermon-notes">{sermon.notes}</p>

                {sermon.type === 'Audio' ? (
                  <div className="audio-player-container">
                    <span className="audio-icon-emoji">🔊</span>
                    <audio controls src={sermon.url}>
                      Your browser does not support the audio element.
                    </audio>
                    <a href={sermon.url} download className="btn btn-sm btn-outline-gold download-sermon-btn">
                      Download MP3
                    </a>
                  </div>
                ) : (
                  <div className="video-sermon-wrapper" style={{ marginTop: '1rem' }}>
                    <div className="video-iframe-wrapper">
                      <iframe
                        src={sermon.url}
                        title={sermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Resources & Newsletters Tab */}
      {activeMediaTab === 'Resources & Newsletters' && (
        <section className="resources-tab animate-fade-in grid-2">
          
          {/* Newsletter Archive */}
          <div className="card text-left">
            <h3>Monthly Newsletter Archive</h3>
            <p className="tab-section-intro">Download past monthly prayer letters and ministry announcements.</p>
            <div className="resource-list">
              {newsletters.map(nl => (
                <div key={nl.id} className="resource-item">
                  <div className="res-icon">📄</div>
                  <div className="res-info">
                    <h4>{nl.title}</h4>
                    <span className="res-meta">{nl.date} • {nl.size}</span>
                    <p className="res-desc">{nl.desc}</p>
                    <a href="#contact" className="res-download-link">
                      ✉️ Contact us to receive this newsletter
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Guides */}
          <div className="card text-left">
            <h3>Bible Study Guides & Books</h3>
            <p className="tab-section-intro">Free study guides and materials for your discipleship journey.</p>
            <div className="resource-list">
              {studyGuides.map(sg => (
                <div key={sg.id} className="resource-item">
                  <div className="res-icon">📚</div>
                  <div className="res-info font-sans">
                    <h4>{sg.title}</h4>
                    <span className="res-meta">Written by {sg.author} • {sg.fileType} ({sg.size})</span>
                    <a href="#publications" className="res-download-link">
                      📖 View in Publications Store →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(26,58,107,0.04)', borderRadius: 8, border: '1px solid var(--glass-border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              💡 More books and study materials are available in our <a href="#publications" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Publications Store</a>.
            </div>
          </div>

        </section>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="modal-content lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close lightbox-close-btn" onClick={() => setLightboxImage(null)}>✕</button>
            <img src={lightboxImage.url} alt={lightboxImage.title} className="lightbox-image" />
            <div className="lightbox-caption text-center">
              <h3>{lightboxImage.title}</h3>
              <span className="badge badge-gold">{lightboxImage.category}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .media-header {
          margin-bottom: 3rem;
        }
        
        /* Photo Category styles */
        .photo-category-bar {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .category-pill {
          padding: 0.45rem 1rem;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--text-secondary);
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .category-pill:hover, .category-pill.active {
          color: white;
          border-color: var(--primary-gold);
        }
        .category-pill.active {
          background-color: rgba(212, 175, 55, 0.15);
          color: var(--primary-gold);
        }

        /* Photo Gallery Grid */
        .gallery-photos-grid {
          margin-bottom: 2rem;
        }
        .gallery-photo-item {
          padding: 0;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          height: 200px;
        }
        .gallery-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }
        .gallery-photo-item:hover .gallery-thumbnail {
          transform: scale(1.05);
        }
        .photo-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(11, 15, 25, 0.95));
          padding: 2.5rem 1rem 1rem;
          opacity: 0;
          transition: var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .gallery-photo-item:hover .photo-info-overlay {
          opacity: 1;
        }
        .photo-info-overlay h4 {
          font-size: 0.95rem;
          color: white;
          margin-bottom: 0.25rem;
        }
        .photo-cat-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--primary-gold);
          letter-spacing: 0.05em;
        }

        /* Videos Gallery styles */
        .video-gallery-item {
          padding: 1rem;
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
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .video-details h4 {
          font-size: 1.1rem;
          color: white;
        }

        /* Sermons tab styles */
        .sermons-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .sermon-item {
          padding: 2rem;
        }
        .sermon-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .sermon-header-row h4 {
          font-size: 1.3rem;
          color: white;
        }
        .sermon-meta-info {
          font-size: 0.8rem;
          color: var(--primary-gold);
          font-weight: 600;
          display: block;
          margin-bottom: 0.25rem;
        }
        .sermon-notes {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .audio-icon-emoji {
          font-size: 1.2rem;
        }
        .download-sermon-btn {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
          white-space: nowrap;
        }
        .video-sermon-wrapper {
          max-width: 650px;
        }

        /* Resources Tab styles */
        .tab-section-intro {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.75rem;
        }
        .resource-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .resource-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        .res-icon {
          font-size: 2.2rem;
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          padding: 0.5rem;
          border-radius: var(--border-radius-sm);
          line-height: 1;
        }
        .res-info h4 {
          font-size: 1.05rem;
          color: white;
          margin-bottom: 0.25rem;
        }
        .res-meta {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary-gold);
          display: block;
          margin-bottom: 0.5rem;
        }
        .res-desc {
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }
        .res-download-link {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-gold);
          text-transform: uppercase;
        }

        /* Lightbox Image Styles */
        .lightbox-overlay {
          background-color: rgba(7, 10, 18, 0.95);
        }
        .lightbox-content {
          max-width: 900px;
          background: none;
          border: none;
          padding: 0;
          box-shadow: none;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: var(--border-radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .lightbox-caption {
          margin-top: 1.25rem;
        }
        .lightbox-caption h3 {
          font-family: var(--font-serif);
          color: white;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }
        .lightbox-close-btn {
          top: -2.5rem;
          right: 0;
          color: white;
          font-size: 1.8rem;
        }

        @media (max-width: 768px) {
          .sermon-item {
            padding: 1.25rem;
          }
          .sermon-header-row {
            flex-direction: column-reverse;
            gap: 0.5rem;
          }
          .audio-player-container {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .audio-player-container audio {
            width: 100%;
          }
          .download-sermon-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

    </div>
  );
}
