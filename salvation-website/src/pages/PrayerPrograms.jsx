import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function PrayerPrograms() {
  const { prayers, submitPrayerRequest, incrementPrayCount } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('programs'); // 'programs' or 'wall'
  const [wallFilter, setWallFilter] = useState('All'); // 'All', 'Needs', 'Praises'
  
  // Submit prayer states
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [requestType, setRequestType] = useState('Need'); // 'Need' or 'Praise'
  const [praiseText, setPraiseText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const regularPrograms = [
    {
      title: "Sunday Service",
      time: "12:00 PM – 1:00 PM",
      days: "Every Sunday",
      platform: "Main Sanctuary & Online Broadcast",
      focus: "Join us for our weekly Sunday worship, teaching, and prayer service.",
      link: "#live-tv"
    },
    {
      title: "End-time Prophetic Broadcast",
      time: "8:00 PM",
      days: "Every Monday",
      platform: "Online Broadcast",
      focus: "Receive prophetic insights, instructions, and deep prayers for the current season.",
      link: "#live-tv"
    },
    {
      title: "Deliverance Program",
      time: "8:00 PM",
      days: "Every Wednesday",
      platform: "Main Sanctuary & Online Broadcast",
      focus: "A powerful session of targeted prayers for spiritual freedom, healing, and deliverance.",
      link: "#live-tv"
    },
    {
      title: "My Friday, My Breakthrough",
      time: "8:00 PM",
      days: "Every Friday",
      platform: "Main Sanctuary & Online Broadcast",
      focus: "Raising End-time Prophetic Generals. Enter your weekend empowered with breakthrough prayers.",
      link: "#live-tv"
    }
  ];

  const handleSubmitPrayer = (e) => {
    e.preventDefault();
    if (!prayerText.trim()) return;

    const authorName = isAnonymous ? 'Anonymous' : name.trim();
    
    if (requestType === 'Praise') {
      // For praises, combine prayer need and answer
      const combinedText = praiseText.trim() 
        ? `${prayerText.trim()} | Testimony: ${praiseText.trim()}`
        : prayerText.trim();
      submitPrayerRequest(authorName, combinedText);
    } else {
      submitPrayerRequest(authorName, prayerText.trim());
    }

    setSubmitted(true);
    setName('');
    setIsAnonymous(false);
    setPrayerText('');
    setPraiseText('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  // Filter prayers list for approved/praise statuses
  const displayPrayers = prayers.filter(p => {
    const isApproved = p.status === 'Approved' || p.status === 'Praise Report';
    if (!isApproved) return false;
    
    if (wallFilter === 'Needs') {
      return p.status === 'Approved';
    }
    if (wallFilter === 'Praises') {
      return p.status === 'Praise Report';
    }
    return true;
  });

  return (
    <div className="prayer-programs-page animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="prayer-header text-center">
        <span className="section-tag">DIVINE INTERCESSION</span>
        <h2>Prayer Programs & Wall</h2>
        <p className="lead-desc">
          "The effectual fervent prayer of a righteous man availeth much." Join our global intercessors or share your burden.
        </p>
      </section>

      {/* Main Tabs Selection */}
      <div className="tab-container main-page-tabs">
        <button
          className={`tab-btn ${activeTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('programs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span className="material-symbols-outlined">calendar_month</span> Weekly Prayer Programs
        </button>
        <button
          className={`tab-btn ${activeTab === 'wall' ? 'active' : ''}`}
          onClick={() => setActiveTab('wall')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span className="material-symbols-outlined">groups</span> Community Prayer Wall
        </button>
      </div>

      {/* Content Section 1: Weekly Programs */}
      {activeTab === 'programs' && (
        <section className="programs-content-section animate-fade-in">
          <div className="grid-2">
            {regularPrograms.map((prog, idx) => (
              <div key={idx} className="card program-card text-left">
                <div className="program-header-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-gold)', fontSize: '24px' }}>local_fire_department</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-blue)', margin: 0 }}>{prog.title}</h3>
                </div>
                <div className="program-details">
                  <div className="detail-line">
                    <strong>⏰ Time:</strong> <span>{prog.time}</span>
                  </div>
                  <div className="detail-line">
                    <strong>📅 Schedule:</strong> <span>{prog.days}</span>
                  </div>
                  <div className="detail-line">
                    <strong>📡 Platform:</strong> <span>{prog.platform}</span>
                  </div>
                  <p className="program-focus-desc">{prog.focus}</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <a href={prog.link} className="btn btn-outline-blue btn-sm">Join Program</a>
                </div>
              </div>
            ))}
          </div>

          <div className="prayer-emergency-banner card text-center" style={{ marginTop: '3rem', borderTop: '4px solid var(--primary-crimson)' }}>
            <h3>Urgent Intercessory Request?</h3>
            <p>Our prayer warriors stand on the wall 24/7 to push back darkness. Contact our intercessory team directly.</p>
            <a href="#contact" className="btn btn-crimson">Call the 24/7 Prayer Line</a>
          </div>
        </section>
      )}

      {/* Content Section 2: Prayer Wall */}
      {activeTab === 'wall' && (
        <section className="wall-content-section animate-fade-in">
          <div className="grid-2 wall-layout-grid">
            
            {/* Left Column: Submit form */}
            <div className="submit-prayer-col text-left">
              <div className="card sticky-prayer-form">
                <h3>Submit to the Prayer Wall</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Post your prayer needs or write a praise report of how the Lord answered your prayer. 
                  All requests are reviewed before showing on the public wall.
                </p>

                {submitted ? (
                  <div className="subscribe-success text-center animate-fade-in" style={{ padding: '2rem 1rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem', color: 'var(--success)' }}>celebration</span>
                    <h4>Request Received!</h4>
                    <p style={{ fontSize: '0.85rem' }}>
                      Thank you for submitting. Our team will review and approve your post shortly. 
                      Let us stand together in faith!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPrayer} className="prayer-form">
                    
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Submission Type</label>
                      <div className="submission-type-toggles" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <button
                          type="button"
                          className={`tab-btn btn-sm ${requestType === 'Need' ? 'active' : ''}`}
                          onClick={() => setRequestType('Need')}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>volunteer_activism</span> Prayer Request
                        </button>
                        <button
                          type="button"
                          className={`tab-btn btn-sm ${requestType === 'Praise' ? 'active' : ''}`}
                          onClick={() => setRequestType('Praise')}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>auto_awesome</span> Praise Report
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        disabled={isAnonymous}
                        required={!isAnonymous}
                      />
                      <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="form-checkbox"
                          style={{ width: '15px', height: '15px' }}
                        />
                        <span>Post anonymously on the wall</span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {requestType === 'Need' ? 'Prayer Need Details *' : 'Original Prayer Request *'}
                      </label>
                      <textarea
                        placeholder={requestType === 'Need' ? "Describe your prayer request so we can intercede for you..." : "What did you ask God to do?"}
                        value={prayerText}
                        onChange={(e) => setPrayerText(e.target.value)}
                        className="form-textarea"
                        required
                        style={{ minHeight: '100px' }}
                      />
                    </div>

                    {requestType === 'Praise' && (
                      <div className="form-group animate-fade-in">
                        <label className="form-label" style={{ color: 'var(--primary-gold)' }}>The Miracle / Praise Report *</label>
                        <textarea
                          placeholder="How did the Lord answer your prayer? Share the testimony to encourage others!"
                          value={praiseText}
                          onChange={(e) => setPraiseText(e.target.value)}
                          className="form-textarea"
                          required
                          style={{ minHeight: '100px', borderColor: 'var(--primary-gold)' }}
                        />
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Submit to Wall
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Approved prayers listing */}
            <div className="prayer-wall-list-col text-left">
              <div className="prayer-wall-filter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Active Prayer Wall</h3>
                
                {/* Wall subfilters */}
                <div className="sub-filters" style={{ display: 'flex', gap: '0.5rem' }}>
                  {['All', 'Needs', 'Praises'].map(subFilter => (
                    <button
                      key={subFilter}
                      className={`tab-btn btn-sm ${wallFilter === subFilter ? 'active' : ''}`}
                      onClick={() => setWallFilter(subFilter)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {subFilter === 'Needs' ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>volunteer_activism</span> Needs
                        </>
                      ) : subFilter === 'Praises' ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>auto_awesome</span> Praises
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>public</span> All
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wall-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {displayPrayers.length === 0 ? (
                  <div className="card text-center" style={{ padding: '3rem' }}>
                    <p style={{ margin: 0 }}>No approved posts found on the wall.</p>
                  </div>
                ) : (
                  displayPrayers.map((prayer) => {
                    const isPraise = prayer.status === 'Praise Report' || prayer.text.includes('| Testimony:');
                    let displayNeed = prayer.text;
                    let displayTestimony = prayer.answer || '';
                    
                    // Parse out combined testimony formats if present
                    if (prayer.text.includes('| Testimony:')) {
                      const parts = prayer.text.split('| Testimony:');
                      displayNeed = parts[0].trim();
                      displayTestimony = parts[1].trim();
                    }

                    return (
                      <div 
                        key={prayer.id} 
                        className={`card prayer-wall-card ${isPraise ? 'praise-card' : ''}`}
                        style={{ 
                          borderLeft: isPraise ? '4px solid var(--primary-gold)' : '4px solid var(--primary-blue)',
                          padding: '1.5rem'
                        }}
                      >
                        <div className="prayer-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isPraise ? 'var(--gold-hover)' : 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span> {prayer.name}
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prayer.date}</span>
                            {isPraise && <span className="badge badge-gold" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', display: 'flex', alignItems: 'center', gap: '0.15rem' }}><span className="material-symbols-outlined" style={{ fontSize: '10px' }}>auto_awesome</span> Praise</span>}
                          </div>
                        </div>

                        <p className="prayer-body-text" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                          {displayNeed}
                        </p>

                        {displayTestimony && (
                          <div 
                            className="testimony-answer-box" 
                            style={{ 
                              backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                              border: '1px dashed rgba(212, 175, 55, 0.25)', 
                              padding: '0.85rem 1rem', 
                              borderRadius: 'var(--border-radius-sm)', 
                              marginTop: '0.75rem',
                              marginBottom: '0.75rem'
                            }}
                          >
                            <h5 style={{ color: 'var(--gold-hover)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span> Miracle Testimony
                            </h5>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                              "{displayTestimony}"
                            </p>
                          </div>
                        )}

                        <div className="prayer-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                          <button
                            onClick={() => incrementPrayCount(prayer.id)}
                            className="btn btn-outline-blue btn-sm pray-btn"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary-crimson)' }}>favorite</span> <span>Stand in Prayer</span>
                          </button>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>groups</span> {prayer.count} {prayer.count === 1 ? 'believer has' : 'believers have'} stood in prayer
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      <style>{`
        .prayer-header {
          margin-bottom: 2.5rem;
        }
        .lead-desc {
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0.5rem auto 0;
        }
        .section-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-gold);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
        }

        .main-page-tabs {
          margin-bottom: 3rem;
        }

        .calendar-bullet-icon {
          font-size: 1.3rem;
        }

        .program-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .program-header-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .program-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-line {
          font-size: 0.9rem;
          display: flex;
          gap: 0.4rem;
        }

        .detail-line strong {
          color: var(--primary-blue);
        }

        .program-focus-desc {
          font-size: 0.9rem;
          line-height: 1.5;
          margin-top: 0.75rem;
          color: var(--text-secondary);
        }

        /* Wall Grid */
        .wall-layout-grid {
          align-items: start;
        }

        .sticky-prayer-form {
          position: sticky;
          top: 90px;
        }

        .submission-type-toggles .tab-btn {
          border-radius: var(--border-radius-sm);
        }

        /* Checkbox details */
        .checkbox-label {
          margin-top: 0.5rem;
        }

        /* Cards list */
        .wall-cards-container {
          max-height: 900px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .praise-card {
          background: linear-gradient(to right, rgba(212, 175, 55, 0.03), transparent), var(--glass-bg);
        }

        /* Pray button micro-interaction */
        .pray-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 900px) {
          .wall-layout-grid {
            grid-template-columns: 1fr;
          }
          .sticky-prayer-form {
            position: static;
          }
        }
      `}</style>

    </div>
  );
}
