import React from 'react'
import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Our Gallery</h1>
        <p>Celebrating Art, Inspiring Creativity</p>
      </div>

      <div className="container">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 1995, our art gallery has been a beacon of creativity and cultural enrichment 
            for over 25 years. What started as a small exhibition space has grown into one of the 
            most respected galleries in the region, showcasing works from both classical masters 
            and contemporary innovators.
          </p>
          <p>
            We believe that art has the power to transform lives, spark conversations, and connect 
            people across cultures and generations. Our carefully curated collection represents 
            diverse artistic movements, techniques, and perspectives, ensuring that every visitor 
            finds something that resonates with them.
          </p>
        </section>

        <section className="mission-vision-section">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To make exceptional art accessible to all by creating an inclusive space where 
              artists and art lovers can connect, learn, and be inspired. We strive to foster 
              appreciation for artistic excellence while supporting both established and emerging artists.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become a leading cultural institution that shapes the future of art appreciation 
              and education. We envision a world where art is celebrated as an essential part of 
              human expression and where creativity flourishes in all its forms.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-icon">💎</div>
            <h3>Our Values</h3>
            <p>
              Excellence, Authenticity, Inclusivity, and Innovation guide everything we do. We are 
              committed to maintaining the highest standards of quality while ensuring our gallery 
              remains welcoming and accessible to everyone.
            </p>
          </div>
        </section>

        <section className="history-section">
          <h2>Our History</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">1995</div>
              <div className="timeline-content">
                <h4>The Beginning</h4>
                <p>Gallery founded with a vision to showcase exceptional contemporary art.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2003</div>
              <div className="timeline-content">
                <h4>Expansion</h4>
                <p>Expanded to include classical masterpieces and international artists.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2015</div>
              <div className="timeline-content">
                <h4>Digital Transformation</h4>
                <p>Launched online gallery to reach art enthusiasts worldwide.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-content">
                <h4>Today</h4>
                <p>Celebrating 30 years of excellence with over 500 artworks and 100+ artists.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <p className="team-intro">
            Our passionate team of curators, art historians, and specialists work tirelessly 
            to bring you the finest art experiences.
          </p>
          
          <div className="team-grid">
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" alt="Sarah Johnson" />
              <h3>Sarah Johnson</h3>
              <p className="team-role">Gallery Director</p>
              <p>With 20+ years in art curation, Sarah leads our vision and strategic direction.</p>
            </div>

            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" alt="Michael Chen" />
              <h3>Michael Chen</h3>
              <p className="team-role">Chief Curator</p>
              <p>Michael's expertise in art history shapes our diverse and compelling collection.</p>
            </div>

            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" alt="Emma Williams" />
              <h3>Emma Williams</h3>
              <p className="team-role">Education Director</p>
              <p>Emma develops programs that make art accessible and engaging for all ages.</p>
            </div>

            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" alt="David Martinez" />
              <h3>David Martinez</h3>
              <p className="team-role">Exhibitions Manager</p>
              <p>David ensures every exhibition is perfectly executed and visually stunning.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
