import { FiExternalLink, FiGithub } from 'react-icons/fi';

const Projects = ({ projects }) => (
  <section id="projects">
    <div className="section">
      <p className="section-label">Projects</p>
      <h2 className="section-title">Things I've <span>built</span></h2>

      <div className="projects-grid">
        {projects?.map((p, i) => (
          <div key={p.title} className="project-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="project-icon-wrap">{p.icon}</div>
            <h3>{p.title}</h3>
            {p.subtitle && <p className="project-subtitle">{p.subtitle}</p>}
            <p>{p.description}</p>
            <div className="project-tags">
              {(Array.isArray(p.tags) ? p.tags : []).map(t => (
                <span key={t} className="project-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              {p.demo_url && p.demo_url !== '#' && (
                <a href={p.demo_url} className="project-link" target="_blank" rel="noreferrer">
                  <FiExternalLink /> Live Demo
                </a>
              )}
              {p.code_url && p.code_url !== '#' && (
                <a href={p.code_url} className="project-link" target="_blank" rel="noreferrer">
                  <FiGithub /> Source
                </a>
              )}
              {(!p.demo_url || p.demo_url === '#') && (!p.code_url || p.code_url === '#') && (
                <span className="project-link" style={{ opacity: 0.35, cursor: 'default' }}>Coming Soon</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
