import { FiBookOpen } from 'react-icons/fi';

const About = ({ profile, skills, education }) => (
  <section id="about">
    <div className="section">
      <p className="section-label">About Me</p>
      <h2 className="section-title">Crafting code that <span>matters</span></h2>

      <div className="about-wrap">
        <div className="about-avatar-wrap reveal-left">
          {/* Swap emoji for: <img src="/your-photo.jpg" alt={profile?.name} className="about-avatar-box" style={{objectFit:'cover'}} /> */}
          <div className="about-avatar-box">👨‍💻</div>
          <div className="about-avatar-glow" />
          <div className="about-avatar-glow-2" />
        </div>

        <div className="about-text reveal-right">
          <p>{profile?.bio}</p>

          {profile?.achievement && (
            <div className="achievement-pill">🏆 {profile.achievement}</div>
          )}

          {education?.map((e, i) => (
            <div key={i} className="edu-card">
              <div className="edu-icon-wrap"><FiBookOpen /></div>
              <div>
                <strong>{e.degree}</strong>
                <p>{e.institution}</p>
                <p className="edu-meta">{e.period} · {e.score}</p>
              </div>
            </div>
          ))}

          <div className="skills-wrap">
            {skills?.map(s => (
              <span key={s.name} className="skill-pill">{s.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
