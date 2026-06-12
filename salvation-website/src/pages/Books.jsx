import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Books() {
  const { books, receiveDonation } = useContext(AppContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [previewChapterIndex, setPreviewChapterIndex] = useState(0);
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState(null);

  // Mock chapter contents for the preview reader
  const mockChapterText = {
    0: "The voice of God rarely comes as a thunderbolt in a clear sky; more often, it is a whisper in the quiet chambers of a searching soul. In my thirty years of life, I had built a fortress of security. A high-paying tech career, a lovely suburban home, and a predictable future. Yet, when I sat on the red dirt of Kakamega, looking into the eyes of a child who had not eaten in two days, the whisper became a deafening roar. 'Whom shall I send?' The question was not directed at the crowd; it was directed at my comfort. This is the story of how that comfort died, and how a new purpose was born...",
    1: "Obedience is not a feeling; it is a direction. When we pack our bags and step onto the field, the romanticism of missions evaporates. In its place remains the daily grind of language learning, water-borne bugs, and spiritual resistance that feels like walking through deep mud. It is in this wilderness that the heart is refined. If you cannot obey in the small details of preparation, you will stumble in the trials of the field...",
    2: "We had prayed for three hours under a tarp as the rain poured. The village elders had warned us that the local witch doctor had cursed our crusade. But as Daniel took the microphone, the rain ceased, and a profound silence fell over the field. That night, we saw the first miracle. Not a blind eye opening, but a hardened heart breaking. A man who had terrorized the local community for a decade fell to his knees in tears, surrendering his weapons and his life to Jesus..."
  };

  const handleBuyClick = (book) => {
    setCheckoutBook(book);
    setCheckoutSuccess(false);
  };

  const executePurchase = (e) => {
    e.preventDefault();
    if (!checkoutBook) return;

    // Register this purchase as a donation (monetization tracking)
    receiveDonation(buyerName || "Anonymous Reader", checkoutBook.price, `Book Purchase: ${checkoutBook.title}`);

    // Generate purchase receipt
    const transactionId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    setPurchaseReceipt({
      id: transactionId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: checkoutBook.price,
      bookTitle: checkoutBook.title,
      buyerName: buyerName || "Anonymous Reader"
    });

    setCheckoutSuccess(true);
    setBuyerName('');
  };

  const closeCheckout = () => {
    setCheckoutBook(null);
    setCheckoutSuccess(false);
    setPurchaseReceipt(null);
  };

  return (
    <div className="books-page animate-fade-in">
      
      {/* Page Header */}
      <section className="books-header text-center">
        <span className="section-tag">PUBLICATIONS</span>
        <h2>Ministry Literature & Books</h2>
        <p className="lead-desc">Equip your faith with writings on spiritual growth, missionary testimonies, and warfare guidelines.</p>
      </section>

      {/* Books Catalog Grid */}
      <section className="books-catalog">
        <div className="grid-3">
          {books.map(book => (
            <div key={book.id} className="card book-card text-left">
              <div className="book-cover-container">
                <img src={book.coverUrl} alt={book.title} className="book-cover-img" />
                <span className="book-price-badge">
                  {book.price === 0 ? 'FREE' : `$${book.price}`}
                </span>
              </div>
              
              <div className="book-card-details">
                <h4>{book.title}</h4>
                <p className="book-desc">{book.description}</p>
                
                <div className="book-actions-row">
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => { setSelectedBook(book); setPreviewChapterIndex(0); }}
                  >
                    Read Preview
                  </button>

                  {book.price === 0 ? (
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => alert("Free eBook Download Started! Thank you.")}
                    >
                      Download Free
                    </button>
                  ) : (
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleBuyClick(book)}
                    >
                      Buy E-Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Book Preview Reader Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>✕</button>
            
            <div className="preview-modal-grid">
              
              {/* Left Column: Book details */}
              <div className="preview-details-col text-left font-sans">
                <img src={selectedBook.coverUrl} alt={selectedBook.title} className="preview-book-cover" />
                <h3>{selectedBook.title}</h3>
                <p className="preview-desc-text">{selectedBook.description}</p>
                <div className="preview-price-box">
                  Price: <strong>{selectedBook.price === 0 ? 'FREE' : `$${selectedBook.price}`}</strong>
                </div>
                
                <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Chapters Index</h4>
                <div className="chapters-list">
                  {selectedBook.previewChapters.map((chapter, idx) => (
                    <button
                      key={idx}
                      className={`chapter-select-btn ${previewChapterIndex === idx ? 'active' : ''}`}
                      onClick={() => setPreviewChapterIndex(idx)}
                    >
                      {chapter.split(':')[0]}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                  {selectedBook.price === 0 ? (
                    <button 
                      className="btn btn-primary btn-block btn-sm"
                      onClick={() => { setSelectedBook(null); alert("Free eBook Download Started!"); }}
                    >
                      Download Free E-Book
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-block btn-sm"
                      onClick={() => { const b = selectedBook; setSelectedBook(null); handleBuyClick(b); }}
                    >
                      Buy E-Book (${selectedBook.price})
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Chapter Text Reader */}
              <div className="preview-text-col text-left">
                <div className="reader-header">
                  <span className="reader-chapter-label">{selectedBook.previewChapters[previewChapterIndex]}</span>
                </div>
                <div className="reader-body">
                  <p className="reader-text-paragraph">
                    {mockChapterText[previewChapterIndex] || "Loading preview content for this chapter. Purchase the full e-book to read the rest."}
                  </p>
                  <div className="reader-blur-fade">
                    <p className="fade-text">Preview ends here. Buy the book to unlock all chapters.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Checkout E-Book Modal (Stripe Mockup) */}
      {checkoutBook && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal-content">
            <button className="modal-close" onClick={closeCheckout}>✕</button>

            {!checkoutSuccess ? (
              <div className="checkout-view text-center">
                <span className="checkout-badge-icon">📖</span>
                <h3>Secure E-Book Purchase</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Purchasing <strong>{checkoutBook.title}</strong> for <strong>${checkoutBook.price}</strong>.
                </p>

                <form onSubmit={executePurchase} className="text-left">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email Address (for download delivery)</label>
                    <input type="email" placeholder="jane@example.com" className="form-input" required />
                  </div>

                  <div className="mock-card-form">
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input type="text" value="••••  ••••  ••••  1881" className="form-input" disabled />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Expiry</label>
                        <input type="text" value="09 / 29" className="form-input" disabled />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input type="text" value="***" className="form-input" disabled />
                      </div>
                    </div>
                  </div>

                  <div className="payment-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeCheckout}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      Confirm Purchase (${checkoutBook.price})
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="checkout-success-view text-center animate-fade-in">
                <span className="success-checkmark">✅</span>
                <h3 className="success-title">Purchase Successful!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Your payment has cleared. Click below to download your copy immediately. We have also sent a copy to your email.
                </p>

                {purchaseReceipt && (
                  <div className="receipt-card text-left" style={{ marginBottom: '1.5rem' }}>
                    <div className="receipt-header text-center">
                      <h4>Salvation & Outreach Publications</h4>
                      <p className="receipt-sub">E-Book Purchase Confirmation</p>
                    </div>
                    <div className="receipt-details">
                      <div className="receipt-row">
                        <span>Transaction ID:</span>
                        <strong>{purchaseReceipt.id}</strong>
                      </div>
                      <div className="receipt-row">
                        <span>Date:</span>
                        <span>{purchaseReceipt.date}</span>
                      </div>
                      <div className="receipt-row">
                        <span>Title:</span>
                        <span>{purchaseReceipt.bookTitle}</span>
                      </div>
                      <div className="receipt-row">
                        <span>Customer:</span>
                        <span>{purchaseReceipt.buyerName}</span>
                      </div>
                      <div className="receipt-total-row">
                        <span>Total Paid:</span>
                        <strong className="receipt-amt-big">${purchaseReceipt.amount.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="checkout-success-actions">
                  <a 
                    href="#" 
                    className="btn btn-primary btn-block" 
                    onClick={(e) => { e.preventDefault(); alert("PDF File Download Triggered!"); }}
                    style={{ marginBottom: '0.75rem' }}
                  >
                    📥 Download PDF E-Book
                  </a>
                  <button className="btn btn-secondary btn-block" onClick={closeCheckout}>
                    Back to Catalog
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        .books-header {
          margin-bottom: 3rem;
        }
        .book-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          height: 100%;
        }
        .book-cover-container {
          position: relative;
          background-color: var(--bg-950);
          height: 280px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid var(--glass-border);
        }
        .book-cover-img {
          height: 90%;
          width: auto;
          object-fit: contain;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          transition: var(--transition-normal);
        }
        .book-card:hover .book-cover-img {
          transform: scale(1.04) translateY(-5px);
        }
        .book-price-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: var(--primary-gold);
          color: var(--bg-950);
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .book-card-details {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 0.5rem;
        }
        .book-card-details h4 {
          font-size: 1.15rem;
          color: white;
        }
        .book-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .book-actions-row {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .book-actions-row .btn {
          flex: 1;
        }

        /* Preview modal styling */
        .preview-modal-content {
          max-width: 950px;
          padding: 0;
          overflow: hidden;
        }
        .preview-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          max-height: 85vh;
        }
        .preview-details-col {
          padding: 2.5rem;
          border-right: 1px solid var(--glass-border);
          overflow-y: auto;
          max-height: 85vh;
        }
        .preview-book-cover {
          width: 140px;
          height: auto;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
          display: block;
        }
        .preview-details-col h3 {
          font-size: 1.4rem;
          color: white;
          margin-bottom: 0.5rem;
        }
        .preview-desc-text {
          font-size: 0.85rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .preview-price-box {
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .preview-price-box strong {
          color: var(--primary-gold);
        }
        .chapters-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .chapter-select-btn {
          text-align: left;
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        .chapter-select-btn:hover {
          color: white;
          border-color: rgba(212, 175, 55, 0.4);
        }
        .chapter-select-btn.active {
          color: var(--primary-gold);
          border-color: var(--primary-gold);
          background-color: rgba(212, 175, 55, 0.05);
        }

        .preview-text-col {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 85vh;
          overflow: hidden;
        }
        .reader-header {
          padding: 1.5rem 2.5rem;
          border-bottom: 1px solid var(--glass-border);
          background-color: rgba(0,0,0,0.1);
        }
        .reader-chapter-label {
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--primary-gold);
          font-size: 1.15rem;
        }
        .reader-body {
          padding: 2.5rem;
          overflow-y: auto;
          flex-grow: 1;
          position: relative;
        }
        .reader-text-paragraph {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          line-height: 1.8;
          color: #e5e7eb;
          text-indent: 2rem;
        }
        .reader-blur-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, var(--bg-900) 80%);
          padding: 4rem 2rem 2.5rem;
          text-align: center;
        }
        .fade-text {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          color: var(--primary-gold);
          font-weight: 600;
          margin: 0;
        }

        /* Checkout Modal */
        .checkout-modal-content {
          max-width: 480px;
        }
        .checkout-badge-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .checkout-success-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .preview-modal-grid {
            grid-template-columns: 1fr;
          }
          .preview-details-col {
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
            max-height: 40vh;
            padding: 1.5rem;
          }
          .preview-book-cover {
            width: 80px;
            margin-bottom: 1rem;
          }
          .preview-text-col {
            max-height: 45vh;
          }
          .reader-header {
            padding: 1rem 1.5rem;
          }
          .reader-body {
            padding: 1.5rem;
          }
        }
      `}</style>

    </div>
  );
}
