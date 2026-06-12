import React from 'react';

export default function Legal({ policyType }) {
  const renderContent = () => {
    switch (policyType) {
      case 'privacy':
        return (
          <div className="card text-left font-sans animate-fade-in">
            <h2>Privacy Policy</h2>
            <p className="policy-date">Last Updated: June 11, 2026</p>
            <div className="policy-body">
              <p>Salvation & Outreach Ministries respects your privacy and is committed to protecting any personal information you share with us. This Privacy Policy details how we collect, use, and safeguard your details.</p>
              
              <h4>1. Information Collection</h4>
              <p>We collect personal information (such as your name, email address, physical address, and contact details) when you voluntarily submit it to us through forms, newsletter signups, or donation simulators.</p>
              
              <h4>2. How We Use Your Information</h4>
              <p>We use your information to process transactions, send monthly updates/prayer letters, respond to volunteer inquiries, and manage prayer requests. We never sell, rent, or trade your personal data to third parties.</p>
              
              <h4>3. Security & Payments</h4>
              <p>All donation forms on this site are mockup simulations. No real credit card details are processed. In a production environment, we utilize secure HTTPS connections and certified third-party processing gateways (Stripe, PayPal) to guarantee data security.</p>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="card text-left font-sans animate-fade-in">
            <h2>Terms of Use</h2>
            <p className="policy-date">Last Updated: June 11, 2026</p>
            <div className="policy-body">
              <p>Welcome to the Salvation Ministries website. By accessing and browsing this site, you agree to comply with and be bound by the following terms of use.</p>
              
              <h4>1. Use of Material</h4>
              <p>All literature, study guides, and newsletter content provided on this website are owned by Salvation Ministries. Free resources may be downloaded and shared for personal, non-commercial, and devotional use only. Paid publications cannot be redistributed without written consent.</p>
              
              <h4>2. User Postings & Moderation</h4>
              <p>Users are welcome to post prayer requests on our Prayer Wall. By posting, you agree to use respectful and faith-affirming language. The ministry reserves the right to moderate, approve, or delete any postings that are deemed inappropriate or spam.</p>
              
              <h4>3. Disclaimer of Liability</h4>
              <p>This website represents a functional demonstration project. Online streaming, mock Stripe integrations, and ebook download catalogs are designed to demonstrate missionary site features.</p>
            </div>
          </div>
        );
      case 'donation-policy':
      default:
        return (
          <div className="card text-left font-sans animate-fade-in">
            <h2>Donation Policy</h2>
            <p className="policy-date">Last Updated: June 11, 2026</p>
            <div className="policy-body">
              <p>At Salvation Ministries, we are committed to exercising the highest standards of stewardship and transparency in managing charitable gifts.</p>
              
              <h4>1. Designated Giving</h4>
              <p>Donations made to specific projects (e.g., "Clean Water Wells", "Bible Distribution") will be directed fully to those designated campaigns. If a campaign is fully funded, excess funds will be redirected to General Support.</p>
              
              <h4>2. Refund Policy</h4>
              <p>As a non-profit ministry, contributions are considered completed, non-refundable donations. If you believe a donation was processed in error or duplicate, please reach out to our finance team.</p>
              
              <h4>3. Demonstration Environment Disclaimer</h4>
              <p>All financial transactions on this website are part of an educational, simulated front-end React sandbox. No real funds are moved or processed.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="legal-page-container">
      <section className="legal-section">
        {renderContent()}
      </section>

      <style>{`
        .legal-page-container {
          max-width: 800px;
          margin: 2rem auto;
        }
        .policy-date {
          font-size: 0.8rem;
          color: var(--primary-gold);
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .policy-body h4 {
          color: white;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .policy-body p {
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
}
