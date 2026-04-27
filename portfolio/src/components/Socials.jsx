import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaTwitter } from 'react-icons/fa';

const iconMap = {
  linkedin: { component: FaLinkedin,     color: '#0a66c2' },
  github:   { component: FaGithub,       color: '#e6edf3' },
  email:    { component: FaEnvelope,     color: '#ea4335' },
  location: { component: FaMapMarkerAlt, color: '#63b3ed' },
  twitter:  { component: FaTwitter,      color: '#1da1f2' },
};

const getIcon = (name) => {
  const key = name.toLowerCase().replace(/[\s/]/g, '');
  const match = Object.keys(iconMap).find(k => key.includes(k));
  return match ? iconMap[match] : null;
};

const Socials = ({ socials }) => (
  <section id="socials">
    <div className="section">
      <p className="section-label">Connect</p>
      <h2 className="section-title">Let's <span>connect</span></h2>

      <div className="socials-grid">
        {socials?.map((s, i) => {
          const def = getIcon(s.name);
          const Icon = def?.component;
          return (
            <a
              key={s.name}
              href={s.url}
              className="social-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              target={s.url?.startsWith('mailto') || s.url === '#' ? '_self' : '_blank'}
              rel="noreferrer"
            >
              <span className="social-icon" style={{ color: def?.color ?? '#63b3ed' }}>
                {Icon ? <Icon size={38} /> : s.icon}
              </span>
              <h3>{s.name}</h3>
              <p>{s.handle}</p>
            </a>
          );
        })}
      </div>
    </div>
  </section>
);

export default Socials;
