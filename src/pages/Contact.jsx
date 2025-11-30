import React, { useState } from 'react'
import { messagesDB } from '../utils/database'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Get current user info if logged in
    const user = JSON.parse(localStorage.getItem('user'))
    
    // Save message to database
    const messageData = {
      ...formData,
      userRole: user?.role || 'visitor',
      userEmail: user?.email || formData.email,
      userName: user?.name || formData.name
    }
    
    messagesDB.add(messageData)
    console.log('Message saved:', messageData)
    
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div className="container">
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Thank you!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Us</h3>
              <p>123 Art Street, Gallery District</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>info@artgallery.com</p>
              <p>sales@artgallery.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>+1 (555) 987-6543</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🕒</div>
              <h3>Opening Hours</h3>
              <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 8:00 PM</p>
              <p>Sunday: 12:00 PM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us on the Map</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844097932764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '15px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gallery Location"
            ></iframe>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="social-section">
          <h2>Follow Us</h2>
          <p>Stay connected with us on social media</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn twitter">
              Twitter
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-btn pinterest">
              Pinterest
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
