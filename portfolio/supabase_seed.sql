-- ============================================================
-- SUPABASE SEED — Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste & run
-- ============================================================

-- PROFILE (single row)
create table if not exists profile (
  id          serial primary key,
  name        text,
  title       text,
  location    text,
  email       text,
  phone       text,
  bio         text,
  achievement text,
  resume_url  text
);

insert into profile (name, title, location, email, phone, bio, achievement, resume_url) values (
  'Vedant Fuley',
  'Software Developer',
  'Raipur, C.G.',
  'vedantfuley@gmail.com',
  '+91 9617370407',
  'Motivated software developer with hands-on experience in building cross-platform applications and a strong foundation in Python programming. Possesses practical exposure to machine learning concepts and implementation, with a growing interest in data science and artificial intelligence. Passionate about exploring advanced ML techniques, working with data-driven solutions, and continuously enhancing technical skills to solve real-world problems.',
  'GATE CS & DA 2026 Qualified',
  '/Vedant_Fuley_Resume.pdf'
);

-- SKILLS
create table if not exists skills (
  id       serial primary key,
  name     text,
  category text
);

insert into skills (name, category) values
  ('Python',           'Languages'),
  ('C Programming',    'Languages'),
  ('C++',              'Languages'),
  ('Flutter',          'Frameworks'),
  ('FastAPI',          'Frameworks'),
  ('Machine Learning', 'AI / Data'),
  ('Data Science',     'AI / Data'),
  ('WGAN-GP / GANs',   'AI / Data'),
  ('LLMs & RAG',       'AI / Data'),
  ('Git',              'Tools'),
  ('MCP',              'Tools'),
  ('REST APIs',        'Tools');

-- EXPERIENCE
create table if not exists experience (
  id       serial primary key,
  company  text,
  location text,
  role     text,
  period   text,
  points   text[]   -- array of bullet points
);

insert into experience (company, location, role, period, points) values (
  'Cargo Pro AI',
  'Bangalore, Karnataka',
  'Software Developer',
  'Aug 2023 – April 2024',
  array[
    'Developed and maintained a cross-platform mobile application using Flutter for logistics and cargo management solutions.',
    'Integrated SIM-based and FASTag-based ULIP APIs, Saarathi APIs and Vaahan APIs to enable real-time vehicle identification and tracking.',
    'Performed debugging, performance optimization, and testing to improve app stability and reliability.'
  ]
);

-- PROJECTS
create table if not exists projects (
  id        serial primary key,
  icon      text,
  title     text,
  subtitle  text,
  description text,
  tags      text[],
  demo_url  text,
  code_url  text
);

insert into projects (icon, title, subtitle, description, tags, demo_url, code_url) values
(
  '🤟',
  'VAANI',
  'Virtual Assistant for Accessible and Natural Indian Sign Language',
  'Implemented WGAN-GP to generate realistic sign language alphabet and number images. Evaluated GAN training stability using discriminator accuracy, loss trends, and visual output assessment.',
  array['Python', 'WGAN-GP', 'GANs', 'Deep Learning'],
  '#', '#'
),
(
  '🎓',
  'HARP',
  'Human Answer Reconciliation Pipeline',
  'Developed an AI-based automated grading system using LLMs, FastAPI, and MCP, supporting batch scoring, RAG evaluation, and flexible grading formats. Implemented modular evaluation pipelines with caching and prompt engineering.',
  array['LLMs', 'FastAPI', 'MCP', 'RAG', 'Python'],
  '#', '#'
);

-- SOCIALS
create table if not exists socials (
  id     serial primary key,
  icon   text,
  name   text,
  handle text,
  url    text
);

insert into socials (icon, name, handle, url) values
  ('💼', 'LinkedIn',  'vedant-fuley',          'https://www.linkedin.com/in/vedantfuley'),
  ('🐙', 'GitHub',    '@vedantfuley',           'https://github.com/vedantfuley'),
  ('📧', 'Email',     'vedantfuley@gmail.com',  'mailto:vedantfuley@gmail.com'),
  ('📍', 'Location',  'Raipur, C.G., India',    '#');

-- EDUCATION
create table if not exists education (
  id          serial primary key,
  degree      text,
  institution text,
  period      text,
  score       text
);

insert into education (degree, institution, period, score) values (
  'Bachelor''s of Technology — Computer Science & Engineering',
  'Bhilai Institute of Technology, Raipur (C.G.)',
  'Oct 2021 – Jul 2025',
  '83.84%'
);

-- Enable Row Level Security (read-only public access)
alter table profile    enable row level security;
alter table skills     enable row level security;
alter table experience enable row level security;
alter table projects   enable row level security;
alter table socials    enable row level security;
alter table education  enable row level security;

create policy "Public read" on profile    for select using (true);
create policy "Public read" on skills     for select using (true);
create policy "Public read" on experience for select using (true);
create policy "Public read" on projects   for select using (true);
create policy "Public read" on socials    for select using (true);
create policy "Public read" on education  for select using (true);
