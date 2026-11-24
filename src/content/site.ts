import type { Site } from './types';

// TODO: replace placeholders with real info.
export const site: Site = {
  name: 'nuha rahman',
  role: 'Software Engineer',
  tagline: 'present day, present time.',
  location: 'Somewhere in the Wired',
  email: 'you@example.com',
  resumeUrl: '/resume.pdf',
  bio: [
    'current: 25 yr old in sf and software engineer @ aurascape. i help build the ts/react/node.js interface that lets companies see and secure how their employees talk and use their ai agents.', 
    'prev: software engineer @ floqast doing web dev with a simliar tech stack and the goal of bringing accounting software out of its dinosaur age. software intern @ expedia on identity team where i owned dev credential rotation for the summer.', 
    'likes: coffee shops, independent news reporting, strength training, compiler optimization theory, electronic music, fuzzing tools, the intersection of art and technology, long form youtube videos, reading (mostly) fiction.',
    'dislikes: crowds that don\'t like to dance, claude generated code redundancy, traffic on the 101, 1s+ renders, cooking from my mom\'s side of the family, betraying oneself, melodic edm, echo chambers, self-limiting beliefs.'
  ],
  skills: [
    { label: 'Languages', items: ['TypeScript', 'JavaScript', 'SQL'] },
    { label: 'Frontend', items: ['React', 'MUI', 'CSS'] },
    { label: 'Backend', items: ['Node.js', 'REST', 'PostgreSQL'] },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};
