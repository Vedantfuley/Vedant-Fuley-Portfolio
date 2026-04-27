import { useState, useEffect } from 'react';

const useTypewriter = (texts, speed = 80, pause = 2000) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
  }, [charIndex, deleting, index, texts, speed, pause]);

  useEffect(() => {
    setDisplayed(texts[index].slice(0, charIndex));
  }, [charIndex, index, texts]);

  return displayed;
};

export default useTypewriter;
