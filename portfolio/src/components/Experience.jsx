const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience">
      <div className="section">
        <p className="section-label">Work Experience</p>
        <h2 className="section-title">Where I've <span>worked</span></h2>

        <div className="exp-timeline">
          {experience.map((job, i) => (
            <div key={i} className="exp-item reveal">
              <div className="exp-card">
                <div className="exp-top">
                  <div>
                    <div className="exp-role">{job.role}</div>
                    <div className="exp-company">{job.company}{job.location ? ` · ${job.location}` : ''}</div>
                  </div>
                  <span className="exp-period">{job.period}</span>
                </div>
                <ul className="exp-points">
                  {(Array.isArray(job.points) ? job.points : []).map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
