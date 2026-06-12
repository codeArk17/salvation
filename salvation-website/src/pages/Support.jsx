import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { submitVolunteer } from '../api/index';

export default function Support() {
  const { donations, receiveDonation, prayers, submitPrayerRequest, incrementPrayCount } = useContext(AppContext);

  // Donation Form States
  const [donateAmount, setDonateAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [campaign, setCampaign] = useState('General Support');
  const [isMonthly, setIsMonthly] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  // Prayer Form States
  const [prayerName, setPrayerName] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Volunteer Form States
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerInterest, setVolunteerInterest] = useState('Mission Trip Participation');
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);

  // Constants
  const preSelectedAmounts = ['1000', '2000', '5000', '10000', '20000'];

  // Handle Donation Submission
  const triggerPaymentSimulation = (e) => {
    e.preventDefault();
    setPaymentModalOpen(true);
  };

  const confirmMockPayment = () => {
    const finalAmount = donateAmount === 'custom' ? parseFloat(customAmount) : parseFloat(donateAmount);
    if (!finalAmount || finalAmount <= 0) return;

    // Receive the donation in the App Context
    receiveDonation(donorName || "Anonymous Partner", finalAmount, campaign);

    // Create Receipt
    const receiptNum = 'REC-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedReceipt({
      receiptNumber: receiptNum,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: finalAmount,
      name: donorName || "Anonymous Partner",
      campaign,
      type: isMonthly ? 'Monthly Partnership' : 'One-Time Giving'
    });

    setPaymentSuccess(true);
    
    // Reset form
    setDonorName('');
    setCustomAmount('');
    setDonateAmount('50');
    setIsMonthly(false);
  };

  // Close payment modal
  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentSuccess(false);
    setGeneratedReceipt(null);
  };

  // Handle Prayer Submission
  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (prayerText) {
      submitPrayerRequest(prayerName, prayerText);
      setPrayerName('');
      setPrayerText('');
      setPrayerSubmitted(true);
      setTimeout(() => setPrayerSubmitted(false), 5000);
    }
  };

  // Handle Volunteer Submission
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (volunteerName && volunteerEmail) {
      try {
        await submitVolunteer({ name: volunteerName, email: volunteerEmail, interest: volunteerInterest });
      } catch (err) {
        console.warn('Volunteer API error (non-blocking):', err.message);
      }
      setVolunteerSubmitted(true);
      setVolunteerName('');
      setVolunteerEmail('');
      setTimeout(() => setVolunteerSubmitted(false), 5000);
    }
  };

  // Filter approved and praise report prayers to display
  const activePrayers = prayers.filter(p => p.status === 'Approved' || p.status === 'Praise Report');

  const fundPercentage = Math.min(Math.round((donations.totalRaised / donations.goal) * 100), 100);

  return (
    <div className="support-page animate-fade-in">
      
      {/* Page Header */}
      <section className="support-header text-center">
        <span className="section-tag">PARTNERSHIP</span>
        <h2>Support & Engagement</h2>
        <p className="lead-desc">Join hands with us to bring relief, supply resources, and spread the Gospel.</p>
      </section>

      {/* Donation Goal Tracking Progress Bar */}
      <section className="goal-tracking-section card text-center">
        <div className="goal-info-row">
          <div>
            <span className="goal-label">MOCK CAMPAIGN GOAL</span>
            <h3>Annual Harvest Mission Goal</h3>
          </div>
          <div className="goal-figures">
            <span className="raised-txt">₦{donations.totalRaised.toLocaleString()}</span>
            <span className="divider-slash">/</span>
            <span className="target-txt">₦{donations.goal.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="goal-progress-bar-container">
          <div className="goal-progress-bar-bg">
            <div className="goal-progress-bar-fill pulse-gold" style={{ width: `${fundPercentage}%` }}></div>
          </div>
          <div className="goal-progress-meta">
            <span>{fundPercentage}% Completed</span>
            <span>{donations.ledger.length} Active Financial Partners</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Donation Form (Left) & Engagement Form (Right) */}
      <section className="grid-2 support-main-grid">
        
        {/* Donation Form Card */}
        <div className="card donation-form-card text-left">
          <h3>Sow a Seed into the Harvest</h3>
          <p className="form-sub-desc">Select an amount or input a custom donation to fund crusades, water wells, and Bibles.</p>
          
          <form onSubmit={triggerPaymentSimulation} className="donation-form">
            
            {/* Predefined Amounts Grid */}
            <div className="amount-grid">
              {preSelectedAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`amount-select-btn ${donateAmount === amt ? 'active' : ''}`}
                  onClick={() => setDonateAmount(amt)}
                >
                  ₦{parseInt(amt).toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                className={`amount-select-btn ${donateAmount === 'custom' ? 'active' : ''}`}
                onClick={() => setDonateAmount('custom')}
              >
                Custom
              </button>
            </div>

            {/* Custom Amount input */}
            {donateAmount === 'custom' && (
              <div className="form-group animate-fade-in">
                <label className="form-label">Custom Amount (₦)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Donor Name (Optional)</label>
              <input
                type="text"
                placeholder="Anonymous"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designate Funds Campaign</label>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="form-select"
              >
                <option value="General Support">General Support (Where Needed Most)</option>
                <option value="Clean Water Wells">Clean Water Wells Project</option>
                <option value="Bible Distribution">Bible Distribution (₦2,500 per Bible)</option>
                <option value="Outreach Crusades">Open-Air Crusades Fund</option>
                <option value="Children Education & Sponsorship">Children Education & Sponsorship</option>
              </select>
            </div>

            {/* Partnership type checkbox */}
            <div className="checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isMonthly}
                  onChange={(e) => setIsMonthly(e.target.checked)}
                />
                <span className="checkmark-box"></span>
                <span className="checkbox-text">Make this a monthly partnership donation</span>
              </label>
            </div>

            {/* Donation Explanation Note */}
            <div className="donation-terms-note">
              <p>🔒 100% of designated funds go directly to local missionary projects. Transactions are mock-simulated in this sandbox catalog environment.</p>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Donate Now
            </button>

          </form>
        </div>

        {/* Volunteer/Get Involved & Mission Trip Card */}
        <div className="card volunteer-form-card text-left">
          <h3>Get Involved: Join the Team</h3>
          <p className="form-sub-desc">Fill out this form to volunteer, sponsor campaigns, or advocate for our mission field work.</p>
          
          {volunteerSubmitted ? (
            <div className="subscribe-success animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3>🎉 Inquiry Submitted!</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>Thank you for your willingness to serve. Our missions director will review your interest and reach out via email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleVolunteerSubmit} className="volunteer-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={volunteerEmail}
                  onChange={(e) => setVolunteerEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Area of Interest</label>
                <select
                  value={volunteerInterest}
                  onChange={(e) => setVolunteerInterest(e.target.value)}
                  className="form-select"
                >
                  <option value="Mission Trip Participation">Mission Trip Participation (Field Outreaches)</option>
                  <option value="Medical Outreach Volunteer">Medical Outreach Volunteer (Doctor/Nurse)</option>
                  <option value="Local Prayer Partnership Network">Local Prayer Partnership Network</option>
                  <option value="Advocacy & Crusade Organiser">Advocacy & Crusade Organiser</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Tell us about yourself</label>
                <textarea
                  placeholder="Tell us about your background, why you want to join us, or any questions you have..."
                  className="form-textarea"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-outline-gold btn-block">
                Submit Volunteer Application
              </button>
            </form>
          )}
        </div>

      </section>

      {/* Prayer Request Submission Form & Approved Prayer Requests Wall */}
      <section className="prayer-wall-section">
        <h2 className="section-title">The Prayer Wall</h2>
        <p className="text-center wall-intro">"For where two or three are gathered together in my name, there am I in the midst of them." — Matthew 18:20</p>
        
        <div className="grid-2 prayer-grid">
          
          {/* Submit Prayer Request */}
          <div className="card prayer-submit-card text-left">
            <h3>Submit a Prayer Request</h3>
            <p className="form-sub-desc">Need prayer or have a praise report? Submit it below. (Requests are moderated by the missionary admin before showing on the wall).</p>
            
            {prayerSubmitted ? (
              <div className="subscribe-success animate-fade-in" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3>🙏 Prayer Request Received</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>Thank you. Your request has been queued for moderation. Our intercessors are already praying for your needs.</p>
              </div>
            ) : (
              <form onSubmit={handlePrayerSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name (or Leave Blank for Anonymous)</label>
                  <input
                    type="text"
                    placeholder="Anonymous"
                    value={prayerName}
                    onChange={(e) => setPrayerName(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Your Prayer Request or Praise Report</label>
                  <textarea
                    placeholder="Describe your prayer need or report a victory of praise..."
                    value={prayerText}
                    onChange={(e) => setPrayerText(e.target.value)}
                    className="form-textarea"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Post Request to Intercessors
                </button>
              </form>
            )}
          </div>

          {/* Prayers Feed Wall */}
          <div className="prayers-wall-container">
            <h3>Active Prayer Requests & Praises</h3>
            <div className="prayers-list-scroll">
              {activePrayers.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No active prayer requests at this moment. Submit the first request!</p>
              ) : (
                activePrayers.map(pr => (
                  <div key={pr.id} className={`prayer-item-card card text-left ${pr.status === 'Praise Report' ? 'praise-report-border' : ''}`}>
                    <div className="prayer-item-header">
                      <span className="prayer-author">{pr.name}</span>
                      <span className="prayer-date">{pr.date}</span>
                    </div>
                    <p className="prayer-text">"{pr.text}"</p>
                    
                    {pr.answer && (
                      <div className="prayer-answer-box">
                        <span className="answer-badge">Praise Report / Answer:</span>
                        <p className="answer-text">{pr.answer}</p>
                      </div>
                    )}

                    <div className="prayer-actions-row">
                      <span className={`badge ${pr.status === 'Praise Report' ? 'badge-success' : 'badge-gold'}`}>
                        {pr.status}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-gold pray-increment-btn"
                        onClick={() => incrementPrayCount(pr.id)}
                      >
                        ❤️ I Prayed for This ({pr.count})
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Simulated Payment Gateway Overlay Modal */}
      {paymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal-content">
            <button className="modal-close" onClick={closePaymentModal}>✕</button>

            {!paymentSuccess ? (
              <div className="payment-simulation text-center">
                <span className="payment-icon">💳</span>
                <h3>Secure Payment Gateway Simulation</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Simulating transaction of <strong>₦{donateAmount === 'custom' ? customAmount : donateAmount}</strong> for <em>{campaign}</em>.
                </p>

                <div className="mock-card-form text-left">
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" value={donorName || 'John Doe'} className="form-input" disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" value="••••  ••••  ••••  4242" className="form-input" disabled />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input type="text" value="12 / 28" className="form-input" disabled />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input type="text" value="***" className="form-input" disabled />
                    </div>
                  </div>
                </div>

                <div className="payment-modal-actions">
                  <button className="btn btn-secondary" onClick={closePaymentModal}>Cancel</button>
                  <button className="btn btn-primary" onClick={confirmMockPayment}>
                    Process Mock Charge
                  </button>
                </div>
              </div>
            ) : (
              <div className="payment-receipt-view text-center animate-fade-in">
                <span className="success-checkmark">✅</span>
                <h3 className="success-title">Donation Successful!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Thank you for your generous gift. Your contribution immediately updates our global campaign metrics.
                </p>

                {/* Printable Receipt Card */}
                {generatedReceipt && (
                  <div className="receipt-card text-left">
                    <div className="receipt-header text-center">
                      <h4>Salvation & Outreach Ministries</h4>
                      <p className="receipt-sub">Official Charitable Contribution Receipt</p>
                    </div>
                    <div className="receipt-details">
                      <div className="receipt-row">
                        <span>Receipt No:</span>
                        <strong>{generatedReceipt.receiptNumber}</strong>
                      </div>
                      <div className="receipt-row">
                        <span>Date & Time:</span>
                        <span>{generatedReceipt.date}</span>
                      </div>
                      <div className="receipt-row">
                        <span>Donor Name:</span>
                        <span>{generatedReceipt.name}</span>
                      </div>
                      <div className="receipt-row">
                        <span>Designation:</span>
                        <span>{generatedReceipt.campaign}</span>
                      </div>
                      <div className="receipt-row">
                        <span>Type:</span>
                        <span>{generatedReceipt.type}</span>
                      </div>
                      <div className="receipt-total-row">
                        <span>Amount Paid:</span>
                        <strong className="receipt-amt-big">₦{generatedReceipt.amount.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="receipt-footer text-center">
                      <p>Salvation Ministries is a simulated 501(c)(3) tax-exempt organization.</p>
                      <p>Thank you for making an impact on the mission field!</p>
                    </div>
                  </div>
                )}

                <div className="payment-modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button className="btn btn-outline-gold" onClick={() => window.print()}>Print Receipt</button>
                  <button className="btn btn-primary" onClick={closePaymentModal}>Done</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        .support-header {
          margin-bottom: 3rem;
        }
        .goal-tracking-section {
          padding: 2.5rem;
          margin-bottom: 4rem;
          background: radial-gradient(circle at bottom left, rgba(212, 175, 55, 0.06), transparent), var(--glass-bg);
        }
        .goal-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
          text-align: left;
        }
        .goal-label {
          color: var(--primary-gold);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          display: block;
        }
        .goal-figures {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .raised-txt {
          font-size: 2.2rem;
          font-family: var(--font-serif);
          color: white;
          font-weight: 700;
        }
        .divider-slash {
          font-size: 1.5rem;
          color: var(--text-muted);
        }
        .target-txt {
          font-size: 1.4rem;
          color: var(--primary-gold);
          font-weight: 600;
        }
        .goal-progress-bar-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .goal-progress-bar-bg {
          height: 16px;
          background-color: var(--bg-950);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          position: relative;
        }
        .goal-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #f5e3a7);
          border-radius: 8px;
          transition: width 1s ease-in-out;
        }
        .goal-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .support-main-grid {
          margin-bottom: 4rem;
        }
        .form-sub-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .amount-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .amount-select-btn {
          padding: 0.75rem;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.1rem;
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          color: white;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .amount-select-btn:hover {
          border-color: rgba(212, 175, 55, 0.5);
        }
        .amount-select-btn.active {
          background-color: var(--primary-gold);
          color: var(--bg-950);
          border-color: var(--primary-gold);
          box-shadow: var(--gold-shadow);
        }
        .checkbox-group {
          margin-bottom: 1.5rem;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          user-select: none;
          gap: 0.75rem;
        }
        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        .checkmark-box {
          height: 20px;
          width: 20px;
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          position: relative;
        }
        .checkbox-container:hover input ~ .checkmark-box {
          border-color: rgba(212, 175, 55, 0.4);
        }
        .checkbox-container input:checked ~ .checkmark-box {
          background-color: var(--primary-gold);
          border-color: var(--primary-gold);
        }
        .checkmark-box:after {
          content: "";
          position: absolute;
          display: none;
        }
        .checkbox-container input:checked ~ .checkmark-box:after {
          display: block;
        }
        .checkbox-container .checkmark-box:after {
          left: 7px;
          top: 3px;
          width: 5px;
          height: 10px;
          border: solid var(--bg-950);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .checkbox-text {
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .donation-terms-note {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--glass-border);
          padding: 0.75rem 1rem;
          border-radius: var(--border-radius-sm);
          margin-bottom: 1.5rem;
        }
        .donation-terms-note p {
          font-size: 0.75rem;
          margin: 0;
          color: var(--text-secondary);
        }
        .btn-block {
          width: 100%;
          padding: 0.9rem;
        }

        .prayer-wall-section {
          margin-bottom: 2rem;
        }
        .wall-intro {
          max-width: 600px;
          margin: 0.5rem auto 3rem;
          font-style: italic;
          font-size: 0.95rem;
        }
        .prayers-wall-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
        }
        .prayers-list-scroll {
          max-height: 580px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-right: 0.5rem;
        }
        .prayer-item-card {
          padding: 1.5rem;
        }
        .praise-report-border {
          border-color: rgba(16, 185, 129, 0.4);
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent), var(--glass-bg);
        }
        .prayer-item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
        }
        .prayer-author {
          font-weight: 700;
          color: white;
        }
        .prayer-date {
          color: var(--text-muted);
        }
        .prayer-text {
          font-size: 0.95rem;
          color: var(--text-primary);
          line-height: 1.6;
          font-style: italic;
          margin-bottom: 1rem;
        }
        .prayer-answer-box {
          background-color: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--border-radius-sm);
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .answer-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--success);
          display: block;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
        }
        .answer-text {
          font-size: 0.9rem;
          margin: 0;
          color: var(--text-primary);
        }
        .prayer-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pray-increment-btn {
          font-size: 0.75rem;
          text-transform: none;
          letter-spacing: 0;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
        }

        /* Payment Simulation Styling */
        .payment-modal-content {
          max-width: 500px;
        }
        .payment-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 0.5rem;
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
        
        .success-checkmark {
          font-size: 4rem;
          display: block;
          margin-bottom: 0.5rem;
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .success-title {
          font-size: 1.6rem;
          color: var(--success);
          margin-bottom: 0.5rem;
        }
        
        /* Receipt Card Styling */
        .receipt-card {
          background-color: white;
          color: #1f2937;
          border-radius: var(--border-radius-sm);
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border: 1px solid #e5e7eb;
          font-family: monospace;
          font-size: 0.85rem;
        }
        .receipt-header {
          border-bottom: 2px dashed #9ca3af;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .receipt-header h4 {
          color: #111827;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }
        .receipt-sub {
          font-size: 0.75rem;
          color: #4b5563;
          margin: 0.25rem 0 0;
        }
        .receipt-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 0.25rem;
        }
        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px dashed #9ca3af;
          padding-top: 1rem;
          margin-top: 0.5rem;
        }
        .receipt-amt-big {
          font-size: 1.3rem;
          color: #111827;
        }
        .receipt-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
          margin-top: 1.5rem;
          font-size: 0.7rem;
          color: #6b7280;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .goal-tracking-section {
            padding: 1.5rem;
          }
          .goal-info-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .raised-txt {
            font-size: 1.8rem;
          }
          .amount-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .payment-modal-content {
            padding: 1.5rem;
          }
          .receipt-card {
            padding: 1rem;
            font-size: 0.75rem;
          }
        }
      `}</style>

    </div>
  );
}
