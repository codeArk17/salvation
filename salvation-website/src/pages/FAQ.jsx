import React, { useState } from 'react';

const faqs = [
  {
    category: 'Supporting the Ministry',
    icon: '💛',
    questions: [
      { q: 'How do I make a donation?', a: 'You can give a one-time or monthly donation directly through our Support page. We accept bank transfers and online payments. Every gift, no matter the size, goes directly to the work of the gospel.' },
      { q: 'Can I designate my donation to a specific project?', a: 'Yes. During the donation process you can select a specific campaign such as Crusade Fund, Bible Distribution, or Clean Water Wells. We honour every designation faithfully.' },
      { q: 'Is my donation tax-deductible?', a: 'We are a registered non-profit ministry. Please contact us directly for official receipts and documentation for tax purposes in your country.' },
      { q: 'How are donations used?', a: 'Funds are used for crusade expenses, Bible printing and distribution, minister training, humanitarian outreach, and the operational costs of the ministry base. Full financial reports are available on request.' },
    ],
  },
  {
    category: 'Mission Trips',
    icon: '✈️',
    questions: [
      { q: 'How can I join a mission trip?', a: 'Fill out the volunteer application on our Support page under "Get Involved." Our team will contact you with available trip dates, requirements, and preparation guidelines.' },
      { q: 'Do I need prior ministry experience?', a: 'No prior ministry experience is required for most roles. A willing heart, commitment to prayer, and a love for souls is the most important qualification.' },
      { q: 'What does a typical mission trip involve?', a: 'Trips typically include open-air outreach, house-to-house evangelism, prayer for the sick, children\'s ministry, and local church support. Duration ranges from one to three weeks.' },
      { q: 'What are the costs involved?', a: 'Participants are responsible for their own travel costs. Accommodation and meals at the ministry base are covered. Some partial scholarships may be available — contact us to discuss.' },
    ],
  },
  {
    category: 'Donations & Finance',
    icon: '💰',
    questions: [
      { q: 'Can I become a monthly partner?', a: 'Yes! Monthly partners are the backbone of the ministry. You can set up a recurring gift on our Support page. Partners receive regular prayer letters and field updates.' },
      { q: 'Do you accept non-monetary donations?', a: 'Yes. We accept Bibles, Christian literature, medical supplies, and equipment for ministry use. Contact us before shipping any items so we can coordinate logistics.' },
      { q: 'How do I cancel or change my recurring gift?', a: 'You can contact us via email or phone at any time to modify or cancel a recurring donation. We process changes within 3–5 business days.' },
      { q: 'Do you have a fundraising goal?', a: 'Our current annual goal is ₦30,000,000 to cover crusade outreaches, Bible printing, minister training, and community development. Every gift moves us closer.' },
    ],
  },
  {
    category: 'General Questions',
    icon: '📖',
    questions: [
      { q: 'Where is the ministry located?', a: 'Our ministry base is at Orile Ilugun, Opposite Adeaga Poultry, Abeokuta–Ibadan Expressway, Abeokuta, Ogun State, Nigeria.' },
      { q: 'How can I contact the ministry directly?', a: 'Call us on +234 802 367 0737 or email contact@salvationoutreach.org. Office hours are Monday–Friday, 9 AM–5 PM WAT.' },
      { q: 'Does the ministry have a statement of faith?', a: 'Yes. We believe in the inspired Word of God, the Trinity, salvation by grace through faith, divine healing, the baptism of the Holy Spirit, and the Great Commission. Visit our About page for the full statement.' },
      { q: 'How can I receive prayer?', a: 'Submit a prayer request through the Prayer Programs page or the Support page. You can also call our 24/7 prayer line. Our intercessory team stands in faith with you.' },
    ],
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <div className="faq-page animate-fade-in font-sans">

      {/* Hero */}
      <section className="faq-hero text-center">
        <span className="section-tag">FREQUENTLY ASKED QUESTIONS</span>
        <h2>How Can We Help?</h2>
        <p className="faq-hero-sub">
          Find answers to the most common questions about supporting the ministry, joining a mission trip, and getting involved.
        </p>
      </section>

      {/* FAQ Sections */}
      <div className="faq-body">
        {faqs.map((section, si) => (
          <section key={si} className="faq-section">
            <div className="faq-section-header">
              <span className="faq-section-icon">{section.icon}</span>
              <h3 className="faq-section-title">{section.category}</h3>
            </div>

            <div className="faq-list">
              {section.questions.map((item, qi) => {
                const key = `${si}-${qi}`;
                const isOpen = openItem === key;
                return (
                  <div key={qi} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer animate-fade-in">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Contact CTA */}
      <section className="faq-cta text-center">
        <h3>Still have questions?</h3>
        <p>Our team is happy to help. Reach out directly and we will respond as soon as possible.</p>
        <div className="faq-cta-btns">
          <a href="#contact" className="btn btn-primary">Contact Us</a>
          <a href="#prayer-programs" className="btn btn-outline-gold">Request Prayer</a>
        </div>
      </section>

      <style>{`
        .faq-hero {
          padding: 3rem 1rem 2.5rem;
          max-width: 680px;
          margin: 0 auto;
        }
        .faq-hero h2 {
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          color: var(--primary-blue);
        }
        .faq-hero-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          margin: 0.75rem auto 0;
          max-width: 560px;
          line-height: 1.6;
        }
        .faq-body {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 1rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .faq-section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--primary-blue);
        }
        .faq-section-icon { font-size: 1.4rem; }
        .faq-section-title {
          font-size: 1.2rem;
          color: var(--primary-blue);
          margin: 0;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
        }
        .faq-item {
          border-bottom: 1px solid var(--glass-border);
          background: #fff;
          transition: var(--transition-fast);
        }
        .faq-item:last-child { border-bottom: none; }
        .faq-item.open { background: #f8fafc; }
        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-blue);
          transition: var(--transition-fast);
        }
        .faq-question:hover { background: rgba(26,58,107,0.02); }
        .faq-chevron {
          font-size: 1.4rem;
          font-weight: 300;
          color: var(--primary-gold);
          flex-shrink: 0;
          line-height: 1;
          width: 24px;
          text-align: center;
        }
        .faq-answer {
          padding: 0 1.5rem 1.5rem;
        }
        .faq-answer p {
          font-size: 0.93rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
          border-left: 3px solid var(--primary-gold);
          padding-left: 1rem;
        }
        .faq-cta {
          max-width: 560px;
          margin: 0 auto;
          padding: 3rem 1rem 4rem;
          border-top: 1px solid var(--glass-border);
        }
        .faq-cta h3 {
          font-size: 1.6rem;
          color: var(--primary-blue);
          margin-bottom: 0.75rem;
        }
        .faq-cta p {
          color: var(--text-secondary);
          margin-bottom: 1.75rem;
        }
        .faq-cta-btns {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
