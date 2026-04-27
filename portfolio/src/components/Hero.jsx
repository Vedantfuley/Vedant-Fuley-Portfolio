import useTypewriter from '../hooks/useTypewriter';
import { FiDownload, FiArrowRight } from 'react-icons/fi';

const roles = ['Software Developer', 'Flutter Engineer', 'ML Enthusiast', 'Python Developer', 'AI Explorer'];

const Hero = ({ onContactClick, profile }) => {
  const role = useTypewriter(roles, 70, 2000);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Available for opportunities
          </div>

          <h1 className="hero-name">
            Hi, I'm{' '}
            <span className="hero-name-accent">{profile?.name ?? 'Vedant Fuley'}</span>
          </h1>

          <p className="hero-role">
            {role}<span className="tw-cursor" />
          </p>

          <p className="hero-bio">{profile?.bio}</p>

          {profile?.achievement && (
            <div className="hero-achievement">
              🏆 {profile.achievement}
            </div>
          )}

          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => go('projects')}>
              View Projects <FiArrowRight />
            </button>
            <button className="btn btn-outline" onClick={onContactClick}>
              Get in Touch
            </button>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                className="btn btn-ghost"
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
              >
                📄 View Resume
              </a>
            )}
          </div>
        </div>

        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>scroll</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
