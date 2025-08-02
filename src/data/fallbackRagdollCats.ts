import { CatData } from '@/services/convexCatService';

// Fallback Ragdoll cat data when no real cats are available in the database
export const FALLBACK_RAGDOLL_CATS: Omit<CatData, '_id' | '_creationTime'>[] = [
  {
    name: 'AURORA',
    subtitle: 'GENTLE SPIRIT',
    image: '/placeholder.svg',
    description: 'Красива женска рагдол с нежен характер, сини очи и мека козина.',
    age: '2 години',
    color: 'Seal point с бели маркировки',
    status: 'Примерна котка',
    gallery: ['/placeholder.svg'],
    gender: 'female',
    birthDate: '2022-03-15',
    registrationNumber: 'RD-2022-001',
    isDisplayed: true,
    category: 'adult',
    freeText: 'Изключително спокойна и приятелска'
  },
  {
    name: 'FELIX',
    subtitle: 'BLUE EYES CHARM',
    image: '/placeholder.svg',
    description: 'Величествен мъжки рагдол с характерни сини очи и спокоен темперамент.',
    age: '3 години',
    color: 'Blue point с бели лапи',
    status: 'Примерна котка',
    gallery: ['/placeholder.svg'],
    gender: 'male',
    birthDate: '2021-08-20',
    registrationNumber: 'RD-2021-002',
    isDisplayed: true,
    category: 'adult',
    freeText: 'Много добродушен и обича прегръдки'
  },
  {
    name: 'LUNA',
    subtitle: 'CLOUD PRINCESS',
    image: '/placeholder.svg',
    description: 'Сладко младо котенце рагдол с мека козина и любопитен характер.',
    age: '8 месеца',
    color: 'Chocolate point',
    status: 'Примерно котенце',
    gallery: ['/placeholder.svg'],
    gender: 'female',
    birthDate: '2024-05-10',
    registrationNumber: 'RD-2024-003',
    isDisplayed: true,
    category: 'kitten',
    freeText: 'Игриво и любопитно котенце'
  },
  {
    name: 'OSCAR',
    subtitle: 'GENTLE GIANT',
    image: '/placeholder.svg',
    description: 'Едър мъжки рагдол с спокоен темперамент и любвеобилен характер.',
    age: '4 години',
    color: 'Lilac point с кремави оттенъци',
    status: 'Примерна котка',
    gallery: ['/placeholder.svg'],
    gender: 'male',
    birthDate: '2020-12-05',
    registrationNumber: 'RD-2020-004',
    isDisplayed: true,
    category: 'adult',
    freeText: 'Перфектният семеен любимец'
  },
  {
    name: 'BELLA',
    subtitle: 'SNOW ANGEL',
    image: '/placeholder.svg',
    description: 'Нежна женска рагдол с ангелски характер и славни размери.',
    age: '1 година',
    color: 'Red point с бели маркировки',
    status: 'Примерна котка',
    gallery: ['/placeholder.svg'],
    gender: 'female',
    birthDate: '2023-01-25',
    registrationNumber: 'RD-2023-005',
    isDisplayed: true,
    category: 'adult',
    freeText: 'Много ласкава и обича вниманието'
  },
  {
    name: 'MILO',
    subtitle: 'TINY TREASURE',
    image: '/placeholder.svg',
    description: 'Дребно котенце рагдол с големи сини очи и игрив дух.',
    age: '5 месеца',
    color: 'Cream point',
    status: 'Примерно котенце',
    gallery: ['/placeholder.svg'],
    gender: 'male',
    birthDate: '2024-08-15',
    registrationNumber: 'RD-2024-006',
    isDisplayed: true,
    category: 'kitten',
    freeText: 'Много активно и забавно котенце'
  }
];

// Function to get fallback cats by category
export const getFallbackRagdollCatsByCategory = (category: 'all' | 'adult' | 'kitten' | 'retired') => {
  if (category === 'all') {
    return FALLBACK_RAGDOLL_CATS;
  }
  
  return FALLBACK_RAGDOLL_CATS.filter(cat => cat.category === category);
};

// Add IDs to fallback cats (for use when displaying)
export const getFallbackRagdollCatsWithIds = (category: 'all' | 'adult' | 'kitten' | 'retired') => {
  const cats = getFallbackRagdollCatsByCategory(category);
  return cats.map((cat, index) => ({
    ...cat,
    _id: `fallback-ragdoll-${index + 1}`,
    _creationTime: Date.now() - (index * 86400000) // Spread creation times
  })) as CatData[];
};