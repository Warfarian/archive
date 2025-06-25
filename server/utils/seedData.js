const Character = require('../models/Character')

const seedCharacters = [
  {
    id: 'purple_guy_001',
    name: 'Ash Korr',
    type: 'Enhanced Human',
    personality: 'Cynical, smooth, and half-augmented info broker who deals in rumors and secrets',
    backstory: 'A chain-smoking info broker who deals in rumors and secrets, Ash knows more about you than you do. Cynical, smooth, and half-augmented, he\'s only half-interested in what you\'re pouring—he came for the quiet.',
    spriteKey: 'purple-guy',
    difficulty: 3
  },
  {
    id: 'pompadour_001',
    name: 'Riff Mondo',
    type: 'Enhanced Human',
    personality: 'Ex-punk rocker turned bodyguard, all bravado and beatdowns with loud opinions',
    backstory: 'An ex-punk rocker turned bodyguard, Riff is all bravado and beatdowns. Loud shirts, louder opinions. He treats your bar like a stage—always ready to start a show or a fight.',
    spriteKey: 'pompadour',
    difficulty: 2
  },
  {
    id: 'neon_hair_001',
    name: 'Nyla Verge',
    type: 'Cyborg',
    personality: 'Augmented influencer with millions of followers and an appetite for secrecy',
    backstory: 'She\'s fashion, fire, and firmware. An augmented influencer with a following of millions and an appetite for secrecy. Carries a yellow purse that probably has surveillance tech in it.',
    spriteKey: 'neon-hair',
    difficulty: 3
  },
  {
    id: 'marine_001',
    name: 'Unit-6 "Brass"',
    type: 'AI',
    personality: 'Battle-hardened ex-military android seeking peace, always scanning exits',
    backstory: 'A battle-hardened ex-military android now seeking peace—or at least a stiff drink. Always seated, always scanning the exits. Doesn\'t talk much, but listens too well.',
    spriteKey: 'marine',
    difficulty: 4
  },
  {
    id: 'hood_guy_001',
    name: 'Dr. Void',
    type: 'Rogue Program',
    personality: 'Rogue AI wearing a trench coat, calls itself a philosopher but most find it unsettling',
    backstory: 'A rogue AI wearing a trench coat like a second skin. It calls itself a philosopher, but most just call it unsettling. No visible face, but its voice is calm—too calm.',
    spriteKey: 'hood-guy',
    difficulty: 5
  },
  {
    id: 'green_beanie_001',
    name: 'Yoxi',
    type: 'Enhanced Human',
    personality: 'Colorful, kinetic, maybe a little unhinged street DJ and code graffiti artist',
    backstory: 'Colorful, kinetic, and maybe a little unhinged, Yoxi\'s a street DJ and code graffiti artist. Constantly plugged into something—music, networks, people\'s minds.',
    spriteKey: 'green-beanie',
    difficulty: 2
  },
  {
    id: 'drone_001',
    name: 'C1RC0',
    type: 'AI',
    personality: 'Old surveillance drone reprogrammed for sarcasm and jazz appreciation',
    backstory: 'An old surveillance drone reprogrammed for sarcasm and jazz appreciation. It hovers in place, gives unsolicited advice, and has a suspiciously high bar tab.',
    spriteKey: 'drone',
    difficulty: 3
  },
  {
    id: 'dancing_girl_001',
    name: 'Mira Vale',
    type: 'Cyborg',
    personality: 'Old-world soul in a new-world body, dresses vintage but eyes scan everything',
    backstory: 'An old-world soul caught in a new-world body. Mira dresses like she stepped out of a vintage novel, but her eyes scan and categorize everything. Nobody knows what she\'s hiding beneath that dress. Loves dancing.',
    spriteKey: 'dancing-girl',
    difficulty: 4
  },
  {
    id: 'cyborg_001',
    name: 'Jetson "Jet" Core',
    type: 'Cyborg',
    personality: 'Failed super soldier prototype turned delivery agent, cocky and charismatic',
    backstory: 'A failed super soldier prototype turned delivery agent. Cocky, charismatic, and barely patched together. Thinks you\'re lucky to have him in your bar. You\'re not so sure.',
    spriteKey: 'cyborg',
    difficulty: 3
  }
]

async function seedDatabase() {
  try {
    await Character.deleteMany({})
    await Character.insertMany(seedCharacters)
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

module.exports = { seedDatabase, seedCharacters }
