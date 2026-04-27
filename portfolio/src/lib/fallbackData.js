// This is the fallback data used when Supabase is not yet configured.
// It also serves as the exact schema/seed for your Supabase tables.

export const fallbackProfile = {
  name: 'Vedant Fuley',
  title: 'Software Developer',
  location: 'Raipur, C.G.',
  email: 'vedantfuley@gmail.com',
  phone: '+91 9617370407',
  bio: `Motivated software developer with hands-on experience in building cross-platform applications and a strong foundation in Python programming. Possesses practical exposure to machine learning concepts and implementation, with a growing interest in data science and artificial intelligence. Passionate about exploring advanced ML techniques, working with data-driven solutions, and continuously enhancing technical skills to solve real-world problems.`,
  achievement: 'GATE CS & DA 2026 Qualified',
  resume_url: '/Vedant_Fuley_Resume.pdf',
};

export const fallbackSkills = [
  { name: 'Python',           category: 'Languages' },
  { name: 'C Programming',    category: 'Languages' },
  { name: 'C++',              category: 'Languages' },
  { name: 'Flutter',          category: 'Frameworks' },
  { name: 'FastAPI',          category: 'Frameworks' },
  { name: 'Machine Learning', category: 'AI / Data' },
  { name: 'Data Science',     category: 'AI / Data' },
  { name: 'WGAN-GP / GANs',   category: 'AI / Data' },
  { name: 'LLMs & RAG',       category: 'AI / Data' },
  { name: 'Git',              category: 'Tools' },
  { name: 'MCP',              category: 'Tools' },
  { name: 'REST APIs',        category: 'Tools' },
];

export const fallbackExperience = [
  {
    company: 'Cargo Pro AI',
    location: 'Bangalore, Karnataka',
    role: 'Software Developer',
    period: 'Aug 2023 – April 2024',
    points: [
      'Developed and maintained a cross-platform mobile application using Flutter for logistics and cargo management solutions.',
      'Integrated SIM-based and FASTag-based ULIP APIs, Saarathi APIs and Vaahan APIs to enable real-time vehicle identification and tracking.',
      'Performed debugging, performance optimization, and testing to improve app stability and reliability.',
    ],
  },
];

export const fallbackProjects = [
  {
    icon: '🤟',
    title: 'VAANI',
    subtitle: 'Virtual Assistant for Accessible and Natural Indian Sign Language',
    description: 'Implemented WGAN-GP to generate realistic sign language alphabet and number images. Evaluated GAN training stability using discriminator accuracy, loss trends, and visual output assessment.',
    tags: ['Python', 'WGAN-GP', 'GANs', 'Deep Learning'],
    demo_url: '#',
    code_url: '#',
  },
  {
    icon: '🎓',
    title: 'HARP',
    subtitle: 'Human Answer Reconciliation Pipeline',
    description: 'Developed an AI-based automated grading system using LLMs, FastAPI, and MCP, supporting batch scoring, RAG evaluation, and flexible grading formats. Implemented modular evaluation pipelines with caching and prompt engineering.',
    tags: ['LLMs', 'FastAPI', 'MCP', 'RAG', 'Python'],
    demo_url: '#',
    code_url: '#',
  },
];

export const fallbackSocials = [
  {
    icon: '💼',
    name: 'LinkedIn',
    handle: 'vedant-fuley',
    url: 'https://www.linkedin.com/in/vedantfuley',
  },
  {
    icon: '🐙',
    name: 'GitHub',
    handle: '@vedantfuley',
    url: 'https://github.com/vedantfuley',
  },
  {
    icon: '📧',
    name: 'Email',
    handle: 'vedantfuley@gmail.com',
    url: 'mailto:vedantfuley@gmail.com',
  },
  {
    icon: '📍',
    name: 'Location',
    handle: 'Raipur, C.G., India',
    url: 'https://www.google.com/maps/search/Raipur,+Chhattisgarh,+India',
  },
];

export const fallbackEducation = [
  {
    degree: "Bachelor's of Technology — Computer Science & Engineering",
    institution: 'Bhilai Institute of Technology, Raipur (C.G.)',
    period: 'Oct 2021 – Jul 2025',
    score: '83.84%',
  },
];
