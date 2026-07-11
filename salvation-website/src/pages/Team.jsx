import React from 'react';

const teamMembers = [
  {
    name: 'Bro Ifeanyi Solomon Raphael Ohiri',
    role: 'Founder & Lead Missionary',
    bio: 'Called to full-time missions, Bro Ifeanyi leads open-air crusades, oversees all ministry operations, church planting, and partner relations across West Africa and beyond.',
    icon: 'church',
    category: 'Leadership',
  },
  {
    name: 'Prophetess Flora Ebere Ohiri',
    role: 'Co-Founder & Lead Missionary',
    bio: 'Prophetess Flora co-leads the ministry, overseeing women\'s ministry, intercession, and humanitarian programmes with zeal and grace.',
    icon: 'volunteer_activism',
    category: 'Leadership',
  },
  {
    name: 'Bro Ifeanyi Solomon Raphael Ohiri',
    role: 'Board Chairman',
    bio: 'As Board Chairman, Bro Ifeanyi provides strategic governance, accountability, and directional leadership for the entire ministry.',
    icon: 'gavel',
    category: 'Board',
  },
  {
    name: 'Prophetess Flora Ebere Ohiri',
    role: 'Board Member',
    bio: 'Provides spiritual oversight and governance support for all ministry activities and decisions.',
    icon: 'star',
    category: 'Board',
  },
  {
    name: 'Pastor Wheto Samuel',
    role: 'Board Member',
    bio: 'Brings pastoral experience and doctrinal accountability to the board, ensuring the ministry stays aligned with biblical principles.',
    icon: 'menu_book',
    category: 'Board',
  },
  {
    name: 'Pastor Kemi Orioye',
    role: 'Board Member',
    bio: 'Oversees ministry welfare, community engagement, and supports the board with insights from pastoral field experience.',
    icon: 'groups',
    category: 'Board',
  },
  {
    name: 'Apostle Dare Odubela',
    role: 'Board Member',
    bio: 'Provides apostolic authority and strategic spiritual direction for the ministry\'s expansion and outreach initiatives.',
    icon: 'auto_awesome',
    category: 'Board',
  },
  {
    name: 'Pastor Adekunle',
    role: 'Medical Outreach Lead',
    bio: 'Coordinates free medical outreach programmes, providing healthcare services to underserved communities during crusades and missions.',
    icon: 'medical_services',
    category: 'Field Team',
  },
  {
    name: 'Lady/Evangelist Funmi Takuro',
    role: 'Finance Minister',
    bio: 'Manages the financial stewardship of the ministry, ensuring full transparency, accountability, and integrity in all financial matters.',
    icon: 'account_balance',
    category: 'Field Team',
  },
  {
    name: 'Bro Ohiri Bright',
    role: 'Media Team',
    bio: 'Handles all media production, broadcasts, and digital content for the ministry — capturing and sharing the gospel through every platform.',
    icon: 'videocam',
    category: 'Field Team',
  },
];

const categories = ['Leadership', 'Board', 'Field Team'];

export default function Team() {
  return (
    <div className="team-page animate-fade-in font-sans">

      {/* Page Hero */}
      <section className="page-hero text-center">
        <span className="section-tag">THE PEOPLE BEHIND THE MISSION</span>
        <h2>Our Team</h2>
        <p className="lead-desc">
          Meet the missionaries, board members, and field workers who make the work of Salvation Series World Outreach possible.
        </p>
      </section>

      {/* Team Sections by Category */}
      {categories.map(cat => {
        const members = teamMembers.filter(m => m.category === cat);
        return (
          <section key={cat} className="team-category-section">
            <div className="category-header">
              <h3 className="category-title">{cat}</h3>
              <div className="category-line" />
            </div>
            <div className="grid-3">
              {members.map((member, idx) => (
                <div key={idx} className="card team-card text-center">
                  <div className="member-avatar">
                    <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-blue)' }}>{member.icon}</span>
                  </div>
                  <h4 className="member-name">{member.name}</h4>
                  <span className="member-role">{member.role}</span>
                  <p className="member-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Volunteer CTA */}
      <section className="team-cta-section text-center">
        <div className="cta-inner card">
          <span className="section-tag">JOIN THE HARVEST</span>
          <h3>Want to Serve With Us?</h3>
          <p>
            Whether you are a medical professional, a prayer warrior, a musician, or simply willing to serve — there is a place for you on this team.
          </p>
          <div className="cta-btns">
            <a href="#support" className="btn btn-primary">Apply as Volunteer</a>
            <a href="#contact" className="btn btn-outline-gold">Contact the Team</a>
          </div>
        </div>
      </section>

      <style>{`
        .team-page { padding-bottom: 3rem; }
        .page-hero { margin-bottom: 3.5rem; padding: 2rem 1rem 0; }
        .lead-desc { font-size: 1.1rem; max-width: 680px; margin: 0.75rem auto 0; color: var(--text-secondary); }
        .team-category-section { margin-bottom: 3.5rem; }
        .category-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; }
        .category-title { font-family: var(--font-serif); font-size: 1.3rem; color: var(--primary-blue); white-space: nowrap; margin: 0; padding: 0; }
        .category-line { flex-grow: 1; height: 1px; background: linear-gradient(to right, var(--primary-gold), transparent); }
        .team-card { display: flex; flex-direction: column; align-items: center; padding: 2rem 1.5rem; text-align: center; gap: 0.5rem; }
        .member-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, rgba(26,58,107,0.06), rgba(201,151,62,0.08)); border: 2px solid var(--glass-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; }
        .member-name { font-size: 1rem; color: var(--primary-blue); margin: 0; }
        .member-role { font-size: 0.78rem; font-weight: 700; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 0.5rem; }
        .member-bio { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }
        .team-cta-section { margin-top: 2rem; }
        .cta-inner { max-width: 640px; margin: 0 auto; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(26,58,107,0.03), rgba(201,151,62,0.04)); }
        .cta-inner h3 { font-size: 1.6rem; margin-bottom: 0.75rem; }
        .cta-inner p { margin-bottom: 1.75rem; }
        .cta-btns { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr; }
          .category-header { gap: 0.75rem; }
          .team-card { padding: 1.5rem 1rem; }
        }
      `}</style>
    </div>
  );
}
