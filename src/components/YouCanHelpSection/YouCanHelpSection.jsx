import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Sun } from 'lucide-react';

/**
 * YouCanHelpSection Component — Simple & Polished 3-Column Footer with Accurate Date Distinction
 * Project Jatayu 3.0 · Rotaract Club of Swarna Bengaluru & Rotaract District 3192
 */
export default function YouCanHelpSection() {
  return (
    <footer className="site-footer" id="take-action">
      <div className="footer-inner-container">
        {/* Main 3-Column Grid */}
        <div className="footer-columns-grid">
          {/* COLUMN 1: Brand & Purpose */}
          <div className="footer-col footer-col-brand">
            <span className="footer-logo-title">PROJECT JATAYU 3.0</span>
            <span className="footer-tagline-sub">Vulture Awareness &amp; Conservation</span>
            <p className="footer-brand-desc">
              Creating awareness about vultures and their vital role in maintaining our ecosystems.
            </p>
          </div>

          {/* COLUMN 2: Navigation Links */}
          <div className="footer-col footer-col-nav">
            <h4 className="footer-col-title">EXPLORE</h4>
            <ul className="footer-links-list">
              <li><a href="#meet-the-vulture">Explore</a></li>
              <li><a href="#why-matters">Why They Matter</a></li>
              <li><a href="#silent-decline">Threats</a></li>
              <li><a href="#way-back">Conservation</a></li>
              <li><a href="#the-trek">Observation Trek</a></li>
            </ul>
          </div>

          {/* COLUMN 3: Event Information & Registration */}
          <div className="footer-col footer-col-event">
            <h4 className="footer-col-title">JOIN THE MOVEMENT</h4>
            
            <a
              href="https://forms.gle/uwx9YqtKBdHVku8J7"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-register-link"
            >
              <span>Register for Jatayu Observation Trek</span>
              <ExternalLink size={14} />
            </a>

            <div className="footer-event-details">
              <div className="footer-date-block">
                <span className="event-name-gold">
                  <Sun size={13} className="inline-icon" /> International Vulture Awareness Day
                </span>
                <span className="event-date-sub">September 5, 2026</span>
              </div>

              <div className="footer-date-block">
                <span className="event-name">Project Jatayu 3.0 Observation Trek</span>
                <div className="event-meta-item">
                  <Calendar size={14} className="meta-icon" />
                  <span>September 6, 2026 (Sunday)</span>
                </div>
                <div className="event-meta-item">
                  <Clock size={14} className="meta-icon" />
                  <span>8:00 AM &ndash; 2:00 PM</span>
                </div>
                <div className="event-meta-item">
                  <MapPin size={14} className="meta-icon" />
                  <span>Ramadevara Betta, Ramanagara</span>
                </div>
                <span className="sanctuary-tag">India&apos;s First Vulture Sanctuary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider & Credits */}
        <div className="footer-divider" />

        <div className="footer-bottom-row">
          <span className="copyright">
            &copy; 2026 Project Jatayu &bull; Rotaract Club of Swarna Bengaluru
          </span>

          <div className="organizers-credit">
            <span>Organized by <strong>Rotaract Club of Swarna Bengaluru</strong> &amp; <strong>Rotaract District 3192</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
