import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Publications() {
  const { books, receiveDonation } = useContext(AppContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [previewChapterIndex, setPreviewChapterIndex] = useState(0);
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState(null);

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

    receiveDonation(buyerName || "Anonymous Reader", checkoutBook.price, `Book Purchase: ${checkoutBook.title}`);

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
    <div className="publications-page animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="publications-header text-center">
        <span className="section-tag">BOOKS STORE</span>
        <h2>Ministry Publications</h2>
        <p className="lead-desc">Equip your faith with specialized study materials and spiritual growth books. Buy paid eBooks or download free publications.</p>
      </section>

      {/* Catalog Grid */}
      <section className="books-catalog">
        <div className="grid-3">
          {books.map(book => (
            <div key={book.id} className="card book-card text-left">
              <div className="book-cover-container">
                <img src={book.coverUrl} alt={book.title} className="book-cover-img" />
                <span className="book-price-badge">
                  {book.price === 0 ? 'FREE' : `₦${book.price.toLocaleString()}`}
                </span>
              </div>
              
              <div className="book-card-details font-sans">
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

      {/* Preview Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>✕</button>
            
            <div className="preview-modal-grid">
              
              {/* Left Column */}
              <div className="preview-details-col text-left font-sans">
                <img src={selectedBook.coverUrl} alt={selectedBook.title} className="preview-book-cover" />
                <h3 style={{ color: 'var(--primary-blue)' }}>{selectedBook.title}</h3>
                <p className="preview-desc-text">{selectedBook.description}</p>
                <div className="preview-price-box">
                  Price: <strong style={{ color: 'var(--primary-blue)' }}>{selectedBook.price === 0 ? 'FREE' : `₦${selectedBook.price.toLocaleString()}`}</strong>
                </div>
                
                <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>Chapters Index</h4>
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
                      Buy E-Book (₦{selectedBook.price.toLocaleString()})
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="preview-text-col text-left">
                <div className="reader-header">
                  <span className="reader-chapter-label">{selectedBook.previewChapters[previewChapterIndex]}</span>
                </div>
                <div className="reader-body">
                  <p className="reader-text-paragraph">
                    {mockChapterText[previewChapterIndex] || "Loading preview content. Buy the full e-book to read further."}
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

      {/* Checkout Modal */}
      {checkoutBook && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal-content">
            <button className="modal-close" onClick={closeCheckout}>✕</button>

            {!checkoutSuccess ? (
              <div className="checkout-view text-center">
                <span className="checkout-badge-icon">📖</span>
                <h3>Secure E-Book Purchase</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Purchasing <strong>{checkoutBook.title}</strong> for <strong>₦{checkoutBook.price.toLocaleString()}</strong>.
                </p>

                <form onSubmit={executePurchase} className="text-left font-sans">
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
                    <label className="form-label">Email Address</label>
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
                      Confirm Purchase (₦{checkoutBook.price.toLocaleString()})
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="checkout-success-view text-center animate-fade-in font-sans">
                <span className="success-checkmark">✅</span>
                <h3 className="success-title" style={{ color: 'var(--success)' }}>Purchase Successful!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Your payment has cleared. Click below to download your copy immediately.
                </p>

                {purchaseReceipt && (
                  <div className="receipt-card text-left" style={{ marginBottom: '1.5rem' }}>
                    <div className="receipt-header text-center">
                      <h4>Salvation Series Publications</h4>
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
                        <strong className="receipt-amt-big">₦{purchaseReceipt.amount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="checkout-success-actions">
                  <a 
                    href="#" 
                    className="btn btn-primary btn-block" 
                    onClick={(e) => { e.preventDefault(); alert("PDF File Download Triggered!"); }}
                    style={{ marginBottom: '0.75rem', color: 'white' }}
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
        .publications-header {
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
          background-color: #f1f5f9;
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
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
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
          color: #111;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
          color: var(--primary-blue);
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
          background-color: #f8fafc;
        }
        .preview-book-cover {
          width: 140px;
          height: auto;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
          display: block;
        }
        .preview-details-col h3 {
          font-size: 1.4rem;
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
        .chapters-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .chapter-select-btn {
          text-align: left;
          background-color: white;
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        .chapter-select-btn:hover {
          color: var(--primary-blue);
          border-color: rgba(30, 58, 138, 0.3);
        }
        .chapter-select-btn.active {
          color: white;
          border-color: var(--primary-blue);
          background-color: var(--primary-blue);
          box-shadow: var(--blue-shadow);
        }

        .preview-text-col {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 85vh;
          overflow: hidden;
          background-color: white;
        }
        .reader-header {
          padding: 1.5rem 2.5rem;
          border-bottom: 1px solid var(--glass-border);
          background-color: #f8fafc;
          text-align: left;
        }
        .reader-chapter-label {
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--primary-blue);
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
          color: var(--text-primary);
          text-indent: 2rem;
        }
        .reader-blur-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, white 80%);
          padding: 4rem 2rem 2.5rem;
          text-align: center;
        }
        .fade-text {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          color: var(--primary-blue);
          font-weight: 700;
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
        
        .mock-card-form {
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .payment-modal-actions {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
        }

        /* Receipt Card Styling */
        .receipt-card {
          background-color: #f9fafb;
          color: #1f2937;
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          font-family: monospace;
          font-size: 0.8rem;
        }
        .receipt-header {
          border-bottom: 2px dashed #9ca3af;
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .receipt-header h4 {
          color: #111827;
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }
        .receipt-sub {
          font-size: 0.7rem;
          color: #4b5563;
          margin: 0.25rem 0 0;
        }
        .receipt-details {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 0.2rem;
        }
        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px dashed #9ca3af;
          padding-top: 0.75rem;
          margin-top: 0.5rem;
        }
        .receipt-amt-big {
          font-size: 1.25rem;
          color: #111827;
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
