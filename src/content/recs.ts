import type { RecCategory } from './types';

export const recs: readonly RecCategory[] = [
  {
    id: 'anime',
    label: 'anime',
    items: [
      {
        title: 'Serial Experiments Lain',
        by: 'Ryūtarō Nakamura',
        note: 'close the world, open the nExt',
      },
      { title: 'Ghost in the Shell', by: 'Mamoru Oshii' },
      { title: 'Neon Genesis Evangelion', by: 'Hideaki Anno' },
      { title: 'Ergo Proxy', by: 'Shūkō Murase' },
      { title: 'Akira', by: 'Katsuhiro Otomo' },
    ],
  },
  {
    id: 'music',
    label: 'music',
    items: [{ title: 'TODO: album / set', by: 'TODO: artist' }],
  },
  {
    id: 'books',
    label: 'books',
    items: [
      { title: 'Abigail', by: 'Magda Szabo' },
      { title: 'The Namesake', by: 'Jhumpa Lahiri' }, 
      { title: 'Crime and Punishment', by: 'Fyodor Dostoevsky' },
      { title: 'The Autobiography of Malcolm X', by: 'Malcolm X & Alex Haley' },

    ],
  },
];
