import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  fallbackProfile,
  fallbackSkills,
  fallbackExperience,
  fallbackProjects,
  fallbackSocials,
  fallbackEducation,
} from '../lib/fallbackData';

const isSupabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url';

const usePortfolioData = () => {
  const [data, setData] = useState({
    profile:    fallbackProfile,
    skills:     fallbackSkills,
    experience: fallbackExperience,
    projects:   fallbackProjects,
    socials:    fallbackSocials,
    education:  fallbackEducation,
    loading:    false,
    source:     'fallback',
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchAll = async () => {
      setData((d) => ({ ...d, loading: true }));
      try {
        const [profile, skills, experience, projects, socials, education] = await Promise.all([
          supabase.from('profile').select('*').single(),
          supabase.from('skills').select('*').order('category'),
          supabase.from('experience').select('*').order('id'),
          supabase.from('projects').select('*').order('id'),
          supabase.from('socials').select('*').order('id'),
          supabase.from('education').select('*').order('id'),
        ]);

        // surface any errors to console for debugging
        [profile, skills, experience, projects, socials, education].forEach(r => {
          if (r.error) console.error('[Supabase]', r.error.message);
        });

        setData({
          profile:    profile.data    ?? fallbackProfile,
          skills:     skills.data     ?? fallbackSkills,
          experience: experience.data ?? fallbackExperience,
          projects:   projects.data   ?? fallbackProjects,
          socials:    socials.data    ?? fallbackSocials,
          education:  education.data  ?? fallbackEducation,
          loading:    false,
          source:     profile.data ? 'supabase' : 'fallback',
        });
      } catch (err) {
        console.error('[Supabase] fetch failed:', err);
        setData((d) => ({ ...d, loading: false, source: 'fallback' }));
      }
    };

    fetchAll();
  }, []);

  return data;
};

export default usePortfolioData;
