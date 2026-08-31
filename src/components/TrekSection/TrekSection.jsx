import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  ExternalLink,
  Users,
  Ticket,
  Utensils,
  Car,
  Handshake,
  Phone,
  UserCheck,
  ArrowRight,
  Compass,
} from 'lucide-react';

/**
 * TrekSection Component — Complete Official Event & Trek Registration Section
 * Project Jatayu 3.0 · Rotaract Club of Swarna Bengaluru (Rotaract District 3192)
 * International Vulture Awareness Day 2026
 */
export default function TrekSection() {
  const googleMapsUrl = 'https://maps.app.goo.gl/shtw8z52dkDX2TYZA';
  const registrationFormUrl = 'https://forms.gle/uwx9YqtKBdHVku8J7';

  // Embed map src for Ramadevara Betta, Ramanagara
  const mapEmbedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15564.088667634888!2d77.2725!3d12.7533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae314545555555%3A0x8e833446059d040!2sRamadevara%20Betta%20Vulture%20Sanctuary!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  return (
    <section className="trek-event-section" id="the-trek">
      {/* Warm Sunlight & Natural Atmosphere Background */}
      <div className="event-bg-atmosphere">
        <div className="sunlight-beam" />
        <div className="natural-landscape-overlay" />
      </div>

      <div className="event-main-container">
        {/* ========================================================
            SECTION TITLE & HERO INTRO
           ======================================================== */}
        <div className="event-header-banner">
          <div className="event-badge-tag">
            <Compass size={16} />
            <span>PROJECT JATAYU 3.0 &bull; VULTURE OBSERVATION &amp; AWARENESS TREK</span>
          </div>

          <h2 className="event-main-heading">
            JOIN <span className="highlight-gold-text">PROJECT JATAYU 3.0</span>
          </h2>

          <p className="event-sub-headline">
            In Celebration of International Vulture Awareness Day 2026
          </p>

          <p className="event-description-text">
            Be a part of Project Jatayu 3.0, a project dedicated to creating awareness, encouraging conservation, and celebrating the vital role of vultures in maintaining our ecosystem. Step into their habitat on September 6 for a Vulture Observation &amp; Awareness Trek at Ramadevara Betta &mdash; India&apos;s First Vulture Sanctuary.
          </p>
        </div>

        {/* ========================================================
            EVENT DETAILS & INTERACTIVE MAP ROW
           ======================================================== */}
        <div className="event-details-map-grid">
          {/* Left: Event Details Card */}
          <div className="event-info-card">
            <div className="card-top-tag">
              <Calendar size={18} />
              <span>EVENT DETAILS</span>
            </div>

            <div className="info-items-list">
              {/* Date */}
              <div className="info-item">
                <div className="item-icon-wrap">
                  <Calendar size={22} className="item-icon" />
                </div>
                <div className="item-content">
                  <span className="item-label">DATE</span>
                  <span className="item-value">September 6, 2026 (Sunday)</span>
                </div>
              </div>

              {/* Time */}
              <div className="info-item">
                <div className="item-icon-wrap">
                  <Clock size={22} className="item-icon" />
                </div>
                <div className="item-content">
                  <span className="item-label">TIME</span>
                  <span className="item-value">8:00 AM – 2:00 PM</span>
                </div>
              </div>

              {/* Venue */}
              <div className="info-item">
                <div className="item-icon-wrap">
                  <MapPin size={22} className="item-icon" />
                </div>
                <div className="item-content">
                  <span className="item-label">VENUE</span>
                  <span className="item-value">Ramadevara Betta, Ramanagara</span>
                </div>
              </div>

              {/* Highlight Badge */}
              <div className="sanctuary-highlight-badge">
                <Award size={20} className="badge-icon" />
                <span>India&apos;s First Vulture Sanctuary</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Google Map Card */}
          <div className="event-map-card">
            <div className="map-card-header">
              <div className="map-title-row">
                <MapPin size={20} className="map-header-icon" />
                <div>
                  <h3 className="map-venue-name">Ramadevara Betta, Ramanagara</h3>
                  <span className="map-venue-sub">Official Event Location</span>
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="open-maps-top-btn"
              >
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Interactive Map Container */}
            <div className="map-iframe-wrapper">
              <iframe
                title="Ramadevara Betta Google Map Location"
                src={mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-overlay-banner">
                <span className="location-pin-label">📍 Ramadevara Betta, Ramanagara</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-overlay-btn"
                >
                  Get Directions &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            REGISTRATION FEE AREA
           ======================================================== */}
        <div className="registration-area-container" id="trek-registration">
          <div className="reg-area-header">
            <span className="reg-eyebrow">EXPEDITION PASSES</span>
            <h3 className="reg-area-title">REGISTRATION FEE</h3>
          </div>

          <div className="pricing-cards-grid">
            {/* Individual Card */}
            <div className="pricing-card individual-card">
              <span className="plan-badge">INDIVIDUAL</span>
              <div className="price-display">
                <span className="currency">₹</span>
                <span className="amount">199</span>
              </div>
              <span className="per-person">per person</span>
              <p className="plan-desc">Standard registration for solo adventurers, students &amp; enthusiasts.</p>
            </div>

            {/* Bulk Card (Prominent & Attractive) */}
            <div className="pricing-card bulk-card featured-bulk">
              <div className="best-value-ribbon">BEST VALUE &bull; GROUP DISCOUNT</div>
              <span className="plan-badge gold-badge">BULK</span>
              <div className="price-display gold-price">
                <span className="currency">₹</span>
                <span className="amount">149</span>
              </div>
              <span className="per-person">per person</span>
              <div className="bulk-eligibility-box">
                <Users size={16} />
                <span>For groups of 10 or more participants</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="reg-cta-center">
            <a
              href={registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="register-now-primary-btn"
            >
              <span>REGISTER NOW</span>
              <ArrowRight size={20} />
            </a>
            <span className="form-direct-note">Official Google Form &bull; Instant Confirmation</span>
          </div>
        </div>

        {/* ========================================================
            LOGISTICS & COLLABORATIONS GRID
           ======================================================== */}
        <div className="logistics-collab-grid">
          {/* Logistics Card */}
          <div className="content-box logistics-box">
            <div className="box-header">
              <Ticket size={20} className="box-header-icon" />
              <h3>LOGISTICS</h3>
            </div>

            <div className="logistics-items">
              <div className="logistics-row">
                <div className="log-icon-wrap">
                  <Ticket size={18} />
                </div>
                <div>
                  <strong>TREK TICKETS</strong>
                  <p>Trek tickets are included in the registration package.</p>
                </div>
              </div>

              <div className="logistics-row">
                <div className="log-icon-wrap">
                  <Utensils size={18} />
                </div>
                <div>
                  <strong>LUNCH</strong>
                  <p>Basic lunch will be provided at Shantinekatan School, Ramanagara.</p>
                </div>
              </div>

              <div className="logistics-row">
                <div className="log-icon-wrap">
                  <Car size={18} />
                </div>
                <div>
                  <strong>TRANSPORTATION</strong>
                  <p>Participants are requested to arrange their own transportation through carpooling or bikes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Collaborations Card */}
          <div className="content-box collab-box">
            <div className="box-header">
              <Handshake size={20} className="box-header-icon" />
              <h3>OPEN FOR COLLABORATIONS</h3>
            </div>

            <div className="collab-content">
              <p className="collab-intro-text">
                &ldquo;We welcome club collaborations and participation from Rotaract clubs.&rdquo;
              </p>

              <div className="collab-criteria-card">
                <div className="criteria-header">
                  <UserCheck size={18} className="criteria-icon" />
                  <strong>COLLABORATION CRITERIA</strong>
                </div>
                <p className="criteria-body">
                  &ldquo;A minimum of 5 Rotaractors from the club must attend the entire conference.&rdquo;
                </p>
              </div>

              <div className="collab-footer-tag">
                <span>Rotaract Clubs &amp; Community Organisations Welcome</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            CONTACT US SECTION
           ======================================================== */}
        <div className="contacts-section">
          <div className="contacts-header">
            <Phone size={20} className="contacts-header-icon" />
            <h3>CONTACT US</h3>
            <p>Reach out to our project chairs and convener for queries, registration &amp; collaborations.</p>
          </div>

          <div className="contacts-grid">
            {/* Contact 1 */}
            <div className="contact-card">
              <h4 className="contact-name">IPP Rtr. Dr. Harish S</h4>
              <span className="contact-role">IPP &amp; Project Chair</span>
              <a href="tel:+919066424105" className="contact-phone-link">
                <Phone size={14} />
                <span>+91 90664 24105</span>
              </a>
            </div>

            {/* Contact 2 */}
            <div className="contact-card">
              <h4 className="contact-name">IPP Rtr. Rajesh R</h4>
              <span className="contact-role">Project Chair</span>
              <a href="tel:+919566621739" className="contact-phone-link">
                <Phone size={14} />
                <span>+91 95666 21739</span>
              </a>
            </div>

            {/* Contact 3 */}
            <div className="contact-card">
              <h4 className="contact-name">Rtr. Vigneshwaran N</h4>
              <span className="contact-role">President</span>
              <a href="tel:+917708960034" className="contact-phone-link">
                <Phone size={14} />
                <span>+91 7708960034</span>
              </a>
            </div>

            {/* Contact 4 (No Phone Number) */}
            <div className="contact-card">
              <h4 className="contact-name">PP Rtr. Krishnarjun</h4>
              <span className="contact-role">Conference Convenor</span>
              <div className="contact-role-badge">Rotaract District 3192</div>
            </div>
          </div>
        </div>

        {/* ========================================================
            ORGANIZING TEAM SECTION
           ======================================================== */}
        <div className="organizers-section">
          <div className="organizers-card">
            <span className="org-label">ORGANIZED BY</span>

            <h3 className="org-club-title">Rotaract Club of Swarna Bengaluru</h3>
            <span className="org-district-subtitle">Rotaract District 3192</span>

            <div className="org-divider" />

            <div className="regards-block">
              <span className="regards-heading">Regards,</span>
              <div className="regards-grid">
                <div className="regard-person">
                  <strong>Rtr. Mohammed Bilal</strong>
                  <span>FH – Supporting Environment</span>
                </div>
                <div className="regard-person">
                  <strong>Rtr. Aarcha U</strong>
                  <span>Director – Community Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            STRONG FINAL EVENT CTA
           ======================================================== */}
        <div className="final-event-cta-banner">
          <h3 className="final-cta-heading">
            READY TO MEET THE CLEANERS OF THE SKIES?
          </h3>
          <p className="final-cta-subheading">
            Celebrate Awareness Day. Experience conservation in the field at Ramadevara Betta on September 6, 2026.
          </p>

          <div className="final-cta-buttons-row">
            <a
              href={registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="final-cta-register-btn"
            >
              <span>REGISTER FOR THE JATAYU OBSERVATION TREK &rarr;</span>
              <ArrowRight size={18} />
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="final-cta-location-btn"
            >
              <MapPin size={16} />
              <span>VIEW LOCATION</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
