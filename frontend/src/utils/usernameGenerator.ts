// Reddit-style username generator for VentAI
const adjectives = [
  'Angry', 'Bitter', 'Cranky', 'Grumpy', 'Moody', 'Salty', 'Snarky', 'Witty',
  'Clever', 'Sharp', 'Quick', 'Bold', 'Fierce', 'Wild', 'Rebel', 'Rogue',
  'Dark', 'Shadow', 'Silent', 'Hidden', 'Secret', 'Mystery', 'Phantom', 'Ghost',
  'Fire', 'Storm', 'Thunder', 'Lightning', 'Chaos', 'Venom', 'Toxic', 'Savage',
  'Mad', 'Crazy', 'Insane', 'Wicked', 'Evil', 'Twisted', 'Broken', 'Lost',
  'Vent', 'Rant', 'Rage', 'Fury', 'Spite', 'Scorn', 'Dread', 'Doom'
];

const nouns = [
  'Venter', 'Ranter', 'Complainer', 'Critic', 'Skeptic', 'Cynic', 'Pessimist',
  'Warrior', 'Fighter', 'Hunter', 'Slayer', 'Destroyer', 'Crusher', 'Breaker',
  'Wolf', 'Tiger', 'Dragon', 'Phoenix', 'Raven', 'Hawk', 'Eagle', 'Viper',
  'Storm', 'Thunder', 'Lightning', 'Fire', 'Ice', 'Shadow', 'Darkness', 'Void',
  'Ninja', 'Samurai', 'Assassin', 'Spy', 'Agent', 'Phantom', 'Ghost', 'Spirit',
  'King', 'Queen', 'Lord', 'Master', 'Chief', 'Boss', 'Leader', 'Commander',
  'Rebel', 'Outlaw', 'Bandit', 'Rogue', 'Pirate', 'Villain', 'Demon', 'Beast'
];

export const generateUsername = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999) + 1;
  
  return `${adjective}${noun}${number}`;
};

export const generateMultipleUsernames = (count: number = 3): string[] => {
  const usernames = new Set<string>();
  
  while (usernames.size < count) {
    usernames.add(generateUsername());
  }
  
  return Array.from(usernames);
}; 