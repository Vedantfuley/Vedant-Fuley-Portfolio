import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FiX, FiSend } from 'react-icons/fi';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isEmailConfigured = SERVICE_ID && SERVICE_ID !== 'your_service_id';

const ContactDialog = ({ isOpen, onClose, profile }) => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (!isEmailConfigured) {
        // EmailJS not set up yet — show a helpful message
        throw new Error('EmailJS not configured');
      }
      await emailjs.send(SERVICE_ID, TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        PUBLIC_KEY
      );
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('[EmailJS]', err);
      if (!isEmailConfigured) {
        setError(`EmailJS not set up yet. Please email directly: vedantfuley@gmail.com`);
      } else {
        setError('Something went wrong. Please email me directly at vedantfuley@gmail.com');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { onClose(); setTimeout(() => setSent(false), 300); };

  // Prevent closing when user drags text selection outside the dialog
  const dragStartedInside = useRef(false);

  const handleOverlayMouseDown = (e) => {
    dragStartedInside.current = e.target !== e.currentTarget;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !dragStartedInside.current) {
      handleClose();
    }
    dragStartedInside.current = false;
  };

  return (
    <div className="dialog-overlay" onMouseDown={handleOverlayMouseDown} onClick={handleOverlayClick}>
      <div className="dialog-box" role="dialog" aria-modal="true">
        <button className="dialog-close" onClick={handleClose} aria-label="Close"><FiX /></button>

        {sent ? (
          <div className="success-msg">
            <span className="success-icon">✅</span>
            <h3>Message Sent!</h3>
            <p>Thanks for reaching out. I'll get back to you soon.</p>
            <button className="btn btn-outline" onClick={handleClose} style={{ marginTop: '1.5rem' }}>Close</button>
          </div>
        ) : (
          <>
            <h2 className="dialog-title">Say Hello 👋</h2>
            <p className="dialog-subtitle">
              Send me a message — I typically reply within 24 hours.
            </p>

            <form onSubmit={onSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name"
                  value={form.name} onChange={onChange} autoComplete="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="your@email.com"
                  value={form.email} onChange={onChange} autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} placeholder="What's on your mind?"
                  value={form.message} onChange={onChange} />
              </div>

              {error && <p className="form-error">⚠ {error}</p>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : <><FiSend /> Send Message</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactDialog;
