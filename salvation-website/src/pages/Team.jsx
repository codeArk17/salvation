import React from 'react';

const teamMembers = [
  {
    name: 'Evangelist Daniel Sterling',
    role: 'Founder & Lead Missionary',
    bio: 'Called to full-time missions in 2015, Daniel leads open-air crusades across East Africa and oversees all ministry operations, church planting, and partner relations.',
    emoji: '🙏',
    category: 'Leadership',
  },
  {
    name: 'Sarah Sterling',
    role: 'Co-Founder & Ministry Director',
    bio: 'Former high school counselor turned missions director, Sarah oversees the Bible School curriculum, women\'s ministry, and humanitarian relief programmes.',
    emoji: '✝️',
    category: 'Leadership',
  },
  {
    name: 'Pastor Emmanuel Okafor',
    role: 'Field Coordinator – East Africa',
    bio: 'Emmanuel coordinates local church plants, trains indigenous pastors, and manages field logistics across Kenya and Uganda.',
    emoji: '🌍',
    category: 'Field Team',
  },
  {
    name: 'Sister Grace Mwangi',
    role: 'Women & Children Outreach Lead',
    bio: 'Grace runs the children\'s Bible clubs, women\'s health clinics, and discipleship groups across rural communities in the ministry\'s core mission zone.',
    emoji: '💛',
    category: 'Field Team',
  },
  {
    name: 'Dr. James Adeyemi',
    role: 'Medical Outreach Volunteer',
    bio: 'A medical doctor who volunteers his skills twice yearly on mission trips, providing free medical care and dental services to remote villagers.',
    emoji: '🏥',
    category: 'Volunteers',
  },
  {
    name: 'Ruth Peterside',
    role: 'Prayer & Intercession Coordinator',
    bio: 'Ruth leads the 24/7 intercessory team, coordinates prayer vigils, and manages the global prayer partner network.',
    emoji: '🔥',
    category: 'Volunteers',
  },
  {
    name: 'Bishop Solomon Alabi',
    role: 'Board Chair',
    bio: 'Oversees governance and accountability for the ministry, bringing 30 years of pastoral experience and strategic leadership.',
    emoji: '📖',
    category: 'Board',
  },
  {
    name: 'Mrs. Adaeze Nwosu',
    role: 'Board Member – Finance',
    bio: 'A certified accountant who ensures full financial transparency, regulatory compliance, and stewardship of all donor contributions.',
    emoji: '📊',
    category: 'Board',
  },
  {
    name: 'Rev. Timothy Bello',
    role: 'Board Member – Theology',
    bio: 'Provides theological oversight and doctrinal accountability for all teaching and ministry publications.',
    emoji: '📜',
    category: 'Board',
  },
];

const categories = ['Leadership', 'Field Team', 'Volunteers', 'Board'];

export default function Team() {
  return (
    <div className="team-page animate-fade-in font-sans">

      {/* Page Hero */}
      <section className="page-hero text-center">
        <span className="section-tag">THE PEOPLE BEHIND THE MISSION</span>
        <h2>Our Team</h2>
        <p className="lead-desc">
          Meet the missionaries, coordinators, volunteers, and board members who make the work of Salvation Series World Outreach possible.
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
                  <div className="member-avatar">{member.emoji}</div>
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
        .team-page {
          padding-bottom: 3rem;
        }
        .page-hero {
          margin-bottom: 3.5rem;
          padding: 2rem 1rem 0;
        }
        .lead-desc {
          font-size: 1.1rem;
          max-width: 680px;
          margin: 0.75rem auto 0;
          color: var(--text-secondary);
        }

        .team-category-section {
          margin-bottom: 3.5rem;
        }
        .category-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .category-title {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--primary-blue);
          white-space: nowrap;
          margin: 0;
          padding: 0;
        }
        .category-line {
          flex-grow: 1;
          height: 1px;
          background: linear-gradient(to right, var(--primary-gold), transparent);
        }

        .team-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem;
          text-align: center;
          gap: 0.5rem;
        }
        .member-avatar {
          font-size: 3rem;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(26,58,107,0.06), rgba(201,151,62,0.08));
          border: 2px solid var(--glass-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .member-name {
          font-size: 1.1rem;
          color: var(--primary-blue);
          margin: 0;
        }
        .member-role {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-gold);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 0.5rem;
        }
        .member-bio {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .team-cta-section {
          margin-top: 2rem;
        }
        .cta-inner {
          max-width: 640px;
          margin: 0 auto;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(26,58,107,0.03), rgba(201,151,62,0.04));
        }
        .cta-inner h3 {
          font-size: 1.6rem;
          margin-bottom: 0.75rem;
        }
        .cta-inner p {
          margin-bottom: 1.75rem;
        }
        .cta-btns {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
