import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Admin() {
  const {
    books, addOrUpdateBook, deleteBook,
    content, addOrUpdateContent, deleteContent,
    prayers, updatePrayerStatus, deletePrayerRequest,
    donations,
    projects, addOrUpdateProject, deleteProject,
    events, addOrUpdateEvent, deleteEvent,
    streamState, setLiveStream,
    isAdminLoggedIn, loginAdmin, logoutAdmin
  } = useContext(AppContext);

  // Auth form states
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState('Stream');

  // Book Editor Form states
  const [editingBook, setEditingBook] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookPrice, setBookPrice] = useState('0');
  const [bookCover, setBookCover] = useState('');
  const [bookChapters, setBookChapters] = useState('');

  // Blog/Content Editor Form states
  const [editingContent, setEditingContent] = useState(null);
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState('Blog');
  const [contentExcerpt, setContentExcerpt] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [contentImage, setContentImage] = useState('');

  // Stream States
  const [streamLive, setStreamLive] = useState(streamState.isLive);
  const [streamUrl, setStreamUrl] = useState(streamState.streamUrl);
  const [streamTitleInput, setStreamTitleInput] = useState(streamState.streamTitle);

  // Prayer approval states
  const [prayerFilter, setPrayerFilter] = useState('Pending');
  const [prayerAnswerText, setPrayerAnswerText] = useState({});

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  // 1. Stream Update Actions
  const handleUpdateStream = (e) => {
    e.preventDefault();
    setLiveStream(streamLive, streamUrl, streamTitleInput);
    alert("Live Stream settings updated successfully!");
  };

  // 2. Book CRUD Actions
  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookTitle(book.title);
    setBookDesc(book.description);
    setBookPrice(book.price.toString());
    setBookCover(book.coverUrl);
    setBookChapters(book.previewChapters.join('\n'));
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    const chaptersArray = bookChapters.split('\n').filter(c => c.trim() !== '');
    const bookObj = {
      id: editingBook ? editingBook.id : null,
      title: bookTitle,
      description: bookDesc,
      price: parseFloat(bookPrice) || 0,
      coverUrl: bookCover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
      previewChapters: chaptersArray.length > 0 ? chaptersArray : ["Chapter 1: Introduction"],
      downloadUrl: "#"
    };

    addOrUpdateBook(bookObj);
    alert("Book details saved successfully!");
    
    // Reset form
    setEditingBook(null);
    setBookTitle('');
    setBookDesc('');
    setBookPrice('0');
    setBookCover('');
    setBookChapters('');
  };

  // 3. Blog Content CRUD Actions
  const handleEditContent = (item) => {
    setEditingContent(item);
    setContentTitle(item.title);
    setContentType(item.type);
    setContentExcerpt(item.excerpt);
    setContentBody(item.content);
    setContentImage(item.image);
  };

  const handleSaveContent = (e) => {
    e.preventDefault();
    const contentObj = {
      id: editingContent ? editingContent.id : null,
      title: contentTitle,
      type: contentType,
      excerpt: contentExcerpt,
      content: contentBody,
      image: contentImage || "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800"
    };

    addOrUpdateContent(contentObj);
    alert("Content publication saved successfully!");

    // Reset Form
    setEditingContent(null);
    setContentTitle('');
    setContentExcerpt('');
    setContentBody('');
    setContentImage('');
  };

  // 4. Prayer Moderation Actions
  const handlePrayerAction = (id, status, answer = "") => {
    updatePrayerStatus(id, status, answer);
    // Clear answer input field for that request
    setPrayerAnswerText(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // Render Login Form if offline
  if (!isAdminLoggedIn) {
    return (
      <div className="admin-login-container animate-fade-in text-center">
        <div className="login-card card">
          <span className="lock-badge">🔒</span>
          <h2>Admin Content Dashboard</h2>
          <p className="login-desc">Enter admin credentials to manage streaming, upload books, update galleries, and moderate prayer requests.</p>
          
          <form onSubmit={handleLogin} className="text-left font-sans">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Enter admin password (use: admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            {loginError && (
              <p className="error-text" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                ❌ Incorrect password. Try 'admin' or 'mission2026'.
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-block">
              Authenticate Admin
            </button>
          </form>
        </div>
        
        <style>{`
          .admin-login-container {
            padding: 4rem 1.5rem;
            display: flex;
            justify-content: center;
          }
          .login-card {
            max-width: 420px;
            width: 100%;
            padding: 3rem 2rem;
          }
          .lock-badge {
            font-size: 3rem;
            display: block;
            margin-bottom: 0.75rem;
          }
          .login-desc {
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
    );
  }

  // Calculate some ledger statistics
  const donationByCampaign = donations.ledger.reduce((acc, curr) => {
    acc[curr.campaign] = (acc[curr.campaign] || 0) + curr.amount;
    return acc;
  }, {});

  return (
    <div className="admin-dashboard-container animate-fade-in font-sans">
      
      {/* Dashboard Header */}
      <section className="dashboard-header-row text-left">
        <div>
          <h2>Admin Control Center</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Missionary Administrator. Manage your ministry content in real-time.</p>
        </div>
        <button className="btn btn-sm btn-danger logout-btn" onClick={logoutAdmin}>
          Exit Admin Mode
        </button>
      </section>

      {/* Dashboard Submenu Navigation */}
      <section className="dashboard-tabs">
        <div className="tab-container font-sans" style={{ justifyContent: 'flex-start' }}>
          {[
            { id: 'Stream', name: '📡 Livestream Broadcast' },
            { id: 'Books', name: '📚 Publications' },
            { id: 'Content', name: '📄 Updates & Blogs' },
            { id: 'Prayers', name: '🙏 Moderation Wall' },
            { id: 'Ledger', name: '💰 Finance & Ledger' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </section>

      {/* 1. Streaming Controller Panel */}
      {activeTab === 'Stream' && (
        <section className="dashboard-tab-panel animate-fade-in grid-2 text-left">
          <div className="card">
            <h3>Livestream Controller</h3>
            <p className="form-sub-desc">Toggle the live status banner and input your YouTube/Vimeo stream embed links.</p>
            
            <form onSubmit={handleUpdateStream}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={streamLive}
                    onChange={(e) => setStreamLive(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Broadcast is LIVE NOW</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Livestream Title</label>
                <input
                  type="text"
                  value={streamTitleInput}
                  onChange={(e) => setStreamTitleInput(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Livestream Iframe Embed URL</label>
                <input
                  type="text"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="form-input"
                  required
                />
                <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                  Must be the embed link format (e.g., https://www.youtube.com/embed/VIDEO_ID).
                </small>
              </div>

              <button type="submit" className="btn btn-primary">
                Update Broadcast Settings
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Livestream Tips & Status</h3>
            <p>Active stream status affects the Homepage alert banner, the navigation bar pill, and activates the Live Chat simulation.</p>
            
            <div className="status-grid" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="status-item card" style={{ padding: '1rem', background: '#0a0f1d' }}>
                <span className="status-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status Badge</span>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {streamState.isLive ? <span style={{ color: 'var(--danger)' }}>🔴 ONLINE BROADCAST</span> : <span style={{ color: 'var(--text-muted)' }}>⚪ OFFLINE</span>}
                </p>
              </div>
              <div className="status-item card" style={{ padding: '1rem', background: '#0a0f1d' }}>
                <span className="status-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Broadcast Title</span>
                <p style={{ margin: 0, fontWeight: 600, color: 'white' }}>{streamState.streamTitle}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. E-Book CRUD Panels */}
      {activeTab === 'Books' && (
        <section className="dashboard-tab-panel animate-fade-in grid-2 text-left">
          
          {/* E-book input form */}
          <div className="card">
            <h3>{editingBook ? 'Edit Book Publication' : 'Add New E-Book'}</h3>
            <p className="form-sub-desc">Publish a new study guide or missionary book with previews, pricing, and cover images.</p>
            
            <form onSubmit={handleSaveBook}>
              <div className="form-group">
                <label className="form-label">Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. Walking in Obedience"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Book Description</label>
                <textarea
                  placeholder="Enter short marketing description of the book..."
                  value={bookDesc}
                  onChange={(e) => setBookDesc(e.target.value)}
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Price ($) (Set 0 for Free)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="14.99"
                    value={bookPrice}
                    onChange={(e) => setBookPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/..."
                    value={bookCover}
                    onChange={(e) => setBookCover(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Preview Chapters (One per line)</label>
                <textarea
                  placeholder="Chapter 1: The Calling&#10;Chapter 2: The Wilderness Preparation&#10;Chapter 3: Standing Firm"
                  value={bookChapters}
                  onChange={(e) => setBookChapters(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                ></textarea>
              </div>

              <div className="payment-modal-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Save Changes' : 'Publish Book'}
                </button>
                {editingBook && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingBook(null);
                      setBookTitle('');
                      setBookDesc('');
                      setBookPrice('0');
                      setBookCover('');
                      setBookChapters('');
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Catalog items list */}
          <div className="card">
            <h3>Active Publications Catalog</h3>
            <p className="form-sub-desc">List of all literature displayed in the store. Edit content or delete books.</p>
            
            <div className="admin-list-scroll">
              {books.map(b => (
                <div key={b.id} className="admin-list-item">
                  <img src={b.coverUrl} alt="" className="admin-thumb-img" />
                  <div className="admin-item-details">
                    <h4>{b.title}</h4>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                      {b.price === 0 ? 'FREE' : `$${b.price}`}
                    </span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEditBook(b)}>
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => { if(window.confirm("Delete book?")) deleteBook(b.id); }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* 3. Blog/Updates CRUD Publisher */}
      {activeTab === 'Content' && (
        <section className="dashboard-tab-panel animate-fade-in grid-2 text-left">
          
          <div className="card">
            <h3>{editingContent ? 'Edit Update Article' : 'Compose News & Blog'}</h3>
            <p className="form-sub-desc">Publish blogs, news, reports, or testimonies to the updates feed.</p>
            
            <form onSubmit={handleSaveContent}>
              <div className="form-group">
                <label className="form-label">Article Title</label>
                <input
                  type="text"
                  placeholder="e.g. Kakamega Crusade Miracle Report"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="form-select"
                  >
                    <option value="Blog">Blog</option>
                    <option value="Devotional">Devotional</option>
                    <option value="Testimony">Testimony</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Feature Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={contentImage}
                    onChange={(e) => setContentImage(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Excerpt / Summary (Brief overview)</label>
                <input
                  type="text"
                  placeholder="Enter a brief summary for the feed list card..."
                  value={contentExcerpt}
                  onChange={(e) => setContentExcerpt(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Article Content (Use double line breaks for paragraphs)</label>
                <textarea
                  placeholder="Write the full report text here..."
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '180px' }}
                  required
                ></textarea>
              </div>

              <div className="payment-modal-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="submit" className="btn btn-primary">
                  {editingContent ? 'Save Article' : 'Publish Article'}
                </button>
                {editingContent && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingContent(null);
                      setContentTitle('');
                      setContentExcerpt('');
                      setContentBody('');
                      setContentImage('');
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h3>Active Publications List</h3>
            <p className="form-sub-desc">List of all blogs, devotionals, and testimonies published on the site.</p>
            
            <div className="admin-list-scroll">
              {content.map(c => (
                <div key={c.id} className="admin-list-item">
                  <img src={c.image} alt="" className="admin-thumb-img" />
                  <div className="admin-item-details">
                    <h4>{c.title}</h4>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                      {c.type}
                    </span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEditContent(c)}>
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => { if(window.confirm("Delete article?")) deleteContent(c.id); }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* 4. Prayer Wall Moderation Widget */}
      {activeTab === 'Prayers' && (
        <section className="dashboard-tab-panel animate-fade-in card text-left">
          <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3>Prayer Wall Moderation Queue</h3>
              <p className="form-sub-desc" style={{ margin: 0 }}>Review user-submitted prayer requests. Approve, mark as Praise Reports, or delete spam.</p>
            </div>
            <div className="category-tabs">
              {['Pending', 'Approved', 'Praise Report'].map(status => (
                <button
                  key={status}
                  className={`tab-btn btn-sm ${prayerFilter === status ? 'active' : ''}`}
                  onClick={() => setPrayerFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="moderation-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {prayers.filter(pr => pr.status === prayerFilter).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>No prayer requests in the "{prayerFilter}" queue.</p>
            ) : (
              prayers.filter(pr => pr.status === prayerFilter).map(pr => (
                <div key={pr.id} className="card mod-item-card" style={{ padding: '1.5rem', backgroundColor: '#0a0f1d' }}>
                  <div className="prayer-item-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'white' }}>{pr.name}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{pr.date}</span>
                  </div>
                  <p style={{ fontStyle: 'italic', color: '#cbd5e1', marginBottom: '1.25rem', fontSize: '0.95rem' }}>"{pr.text}"</p>
                  
                  {pr.answer && (
                    <div className="current-answer-view" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Praise Report Answer:</span>
                      <span style={{ fontSize: '0.85rem' }}>{pr.answer}</span>
                    </div>
                  )}

                  {/* Intercessor Response Input */}
                  {prayerFilter === 'Approved' && (
                    <div className="prayer-answer-input-box" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Add Intercession Answer / Praise Report (Converts request to a Praise Report)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="e.g. Healed from illness! Praise God!"
                          value={prayerAnswerText[pr.id] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrayerAnswerText(prev => ({ ...prev, [pr.id]: val }));
                          }}
                          className="form-input"
                          style={{ padding: '0.5rem' }}
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            const ans = prayerAnswerText[pr.id] || '';
                            if(!ans.trim()) return alert("Please enter an answer text first.");
                            handlePrayerAction(pr.id, 'Praise Report', ans);
                          }}
                        >
                          Submit Answer
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="moderator-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                    {prayerFilter === 'Pending' && (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={() => handlePrayerAction(pr.id, 'Approved')}>
                          Approve Request
                        </button>
                        <button className="btn btn-sm btn-outline-gold" onClick={() => {
                          const ans = window.prompt("Enter praise answer (converts directly to Praise Report):");
                          if(ans !== null) handlePrayerAction(pr.id, 'Praise Report', ans);
                        }}>
                          Mark as Praise Report
                        </button>
                      </>
                    )}
                    
                    {prayerFilter !== 'Pending' && (
                      <button className="btn btn-sm btn-secondary" onClick={() => handlePrayerAction(pr.id, 'Pending')}>
                        Move to Pending Moderation
                      </button>
                    )}

                    <button className="btn btn-sm btn-danger" onClick={() => { if(window.confirm("Delete request?")) deletePrayerRequest(pr.id); }} style={{ marginLeft: 'auto' }}>
                      Delete Request
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* 5. Finance Ledger Panel */}
      {activeTab === 'Ledger' && (
        <section className="dashboard-tab-panel animate-fade-in text-left">
          
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <h3>Partnership Campaigns Allocation</h3>
              <p className="form-sub-desc">Distribution of funds raised by campaign tags.</p>
              
              <div className="campaigns-breakdown-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {Object.keys(donationByCampaign).map(camp => (
                  <div key={camp} className="campaign-stat-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'white' }}>{camp}</strong>
                      <span style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>${donationByCampaign[camp].toLocaleString()}</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '6px' }}>
                      <div className="progress-bar-fill" style={{ width: `${Math.min((donationByCampaign[camp] / donations.totalRaised) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Recent Ledger Transactions</h3>
              <p className="form-sub-desc">List of all financial receipts generated.</p>
              
              <div className="admin-list-scroll" style={{ maxHeight: '300px' }}>
                {donations.ledger.map(d => (
                  <div key={d.id} className="ledger-row-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: 'white' }}>{d.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.campaign} • {d.date}</p>
                    </div>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>+${d.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      )}

      <style>{`
        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .logout-btn {
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
        }
        .dashboard-tabs {
          margin-bottom: 2rem;
        }
        
        /* List scroll styling */
        .admin-list-scroll {
          max-height: 480px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 0.25rem;
        }
        .admin-list-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background-color: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-sm);
          padding: 0.75rem 1rem;
        }
        .admin-thumb-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
        }
        .admin-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        .admin-item-details h4 {
          font-size: 0.95rem;
          color: white;
          margin: 0;
        }
        .admin-item-actions {
          display: flex;
          gap: 0.5rem;
        }
        .admin-item-actions .btn {
          padding: 0.4rem;
          line-height: 1;
        }
      `}</style>

    </div>
  );
}
