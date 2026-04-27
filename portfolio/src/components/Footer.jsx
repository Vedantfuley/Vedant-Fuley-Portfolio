const Footer = ({ profile }) => (
  <footer>
    <div className="footer">
      <p>© {new Date().getFullYear()} <span>{profile?.name ?? 'Vedant Fuley'}</span>. All rights reserved.</p>
      <div className="footer-links">
        <a href="https://www.linkedin.com/in/vedantfuley" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/vedantfuley" target="_blank" rel="noreferrer">GitHub</a>
        <a href="mailto:vedantfuley@gmail.com">Email</a>
      </div>
    </div>
  </footer>
);

export default Footer;
