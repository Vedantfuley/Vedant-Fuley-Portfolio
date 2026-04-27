import { FiMail } from 'react-icons/fi';

const ContactSection = ({ onContactClick }) => (
  <section id="contact">
    <div className="section">
      <div className="contact-center">
        <p className="section-label" style={{ justifyContent: 'center' }}>Contact</p>
        <h2 className="section-title">Get in <span>touch</span></h2>
        <p>
          Have a project in mind, want to collaborate, or just want to say hi?
          My inbox is always open — I'll get back to you as soon as possible.
        </p>
        <button className="btn btn-primary" onClick={onContactClick}>
          <FiMail /> Send a Message
        </button>
      </div>
    </div>
  </section>
);

export default ContactSection;
