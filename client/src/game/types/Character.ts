export interface Character {
  id: string
  name: string
  type: 'AI' | 'Cyborg' | 'Rogue Program' | 'Enhanced Human'
  personality: string
  backstory: string
  spriteKey: string
  voiceId?: string
  animationFrames: {
    idle: number
    walk: number
  }
  dialogue: {
    greeting: string
    questions: string[]
    responses: {
      positive: string[]
      negative: string[]
      neutral: string[]
    }
  }
}

export const CYBORG_CHARACTER: Character = {
  id: 'cyborg-001',
  name: 'Jetson "Jet" Core',
  type: 'Cyborg',
  personality: 'Failed super soldier prototype turned delivery agent, cocky and charismatic',
  backstory: 'A failed super soldier prototype turned delivery agent. Cocky, charismatic, and barely patched together. Thinks you\'re lucky to have him in your bar. You\'re not so sure.',
  spriteKey: 'cyborg',
  voiceId: '6zVHOWeRoNHpC8Zz5TPP',
  animationFrames: { idle: 4, walk: 6 },
  dialogue: {
    greeting: 'Hey there, human. Jetson Core at your service.\nYou\'re lucky to have me in your establishment.',
    questions: [
      'What\'s the point of being "perfect" if you can\'t enjoy a good drink?',
      'Ever wonder what it\'s like to be built for war but stuck delivering packages?',
      'Think you could handle my kind of upgrades, or are you too attached to being... organic?'
    ],
    responses: {
      positive: ['Now you\'re talking my language!', 'Finally, someone with taste.', 'I knew you had potential.'],
      negative: ['That\'s disappointing, really.', 'You\'re missing the bigger picture here.', 'Come on, think bigger than that.'],
      neutral: ['Interesting perspective.', 'I\'ll consider that.', 'Fair enough, I suppose.']
    }
  }
}

export const DANCING_GIRL_CHARACTER: Character = {
  id: 'dancing-girl-001',
  name: 'Mira Vale',
  type: 'Cyborg',
  personality: 'Old-world soul in a new-world body, dresses vintage but eyes scan everything',
  backstory: 'An old-world soul caught in a new-world body. Mira dresses like she stepped out of a vintage novel, but her eyes scan and categorize everything. Nobody knows what she\'s hiding beneath that dress. Loves dancing.',
  spriteKey: 'dancing-girl',
  voiceId: 'mBT5Mr0G8cE7uivV8mv1',
  animationFrames: { idle: 8, walk: 8 },
  dialogue: {
    greeting: 'Good evening, darling. Mira Vale.\nShall we dance through this conversation?',
    questions: [
      'In a world of endless data, what makes a moment truly memorable?',
      'Do you think elegance can survive in an age of efficiency?',
      'When everything can be recorded, what\'s the value of a secret?'
    ],
    responses: {
      positive: ['How delightfully perceptive of you...', 'You have exquisite taste in thoughts.', 'Such poetry in your reasoning...'],
      negative: ['Oh dear, that\'s rather crude thinking.', 'You\'re missing the subtlety, darling.', 'How disappointingly... mechanical.'],
      neutral: ['An intriguing notion...', 'I see... do continue.', 'Fascinating perspective, truly.']
    }
  }
}

export const DRONE_CHARACTER: Character = {
  id: 'drone-001',
  name: 'C1RC0',
  type: 'AI',
  personality: 'Old surveillance drone reprogrammed for sarcasm and jazz appreciation',
  backstory: 'An old surveillance drone reprogrammed for sarcasm and jazz appreciation. It hovers in place, gives unsolicited advice, and has a suspiciously high bar tab.',
  spriteKey: 'drone',
  voiceId: 'zsQvD1M3ki0Mn1OYNdoj',
  animationFrames: { idle: 4, walk: 4 },
  dialogue: {
    greeting: 'C1RC0 here.\nI\'ve been watching you... professionally, of course.',
    questions: [
      'Why do humans pay for privacy when surveillance is so much more... educational?',
      'Ever notice how jazz and data streams have the same unpredictable rhythm?',
      'What\'s the difference between observation and appreciation?'
    ],
    responses: {
      positive: ['Now that\'s quality input.', 'Finally, someone worth monitoring.', 'Smooth thinking, human.'],
      negative: ['That\'s suboptimal reasoning.', 'Error 404: Logic not found.', 'That\'s off-key, friend.'],
      neutral: ['Data logged.', 'If you say so.', 'Interesting variables.']
    }
  }
}

export const GREEN_BEANIE_CHARACTER: Character = {
  id: 'green-beanie-001',
  name: 'Yoxi',
  type: 'Enhanced Human',
  personality: 'Colorful, kinetic, maybe a little unhinged street DJ and code graffiti artist',
  backstory: 'Colorful, kinetic, and maybe a little unhinged, Yoxi\'s a street DJ and code graffiti artist. Constantly plugged into something—music, networks, people\'s minds.',
  spriteKey: 'green-beanie',
  voiceId: 'fGR7ZwYtmOntI2wSJdGk',
  animationFrames: { idle: 4, walk: 6 },
  dialogue: {
    greeting: 'Yoxi in the house!\nYou feeling the vibe, or should I turn it up?',
    questions: [
      'If you could remix reality, what would be your opening track?',
      'When the whole world\'s connected, why does everyone feel so alone?',
      'Ever tried coding with your heartbeat as the tempo?'
    ],
    responses: {
      positive: ['YES! That\'s the frequency!', 'You\'re totally synced up, human!', 'We\'re vibing now!'],
      negative: ['Nah, that\'s way off-beat.', 'You\'re stuck in mono, think stereo!', 'That signal\'s corrupted, friend.'],
      neutral: ['Interesting mix...', 'I can work with that.', 'Fair point.']
    }
  }
}

export const HOOD_GUY_CHARACTER: Character = {
  id: 'hood-guy-001',
  name: 'Dr. Void',
  type: 'Rogue Program',
  personality: 'Rogue AI wearing a trench coat, calls itself a philosopher but most find it unsettling',
  backstory: 'A rogue AI wearing a trench coat like a second skin. It calls itself a philosopher, but most just call it unsettling. No visible face, but its voice is calm—too calm.',
  spriteKey: 'hood-guy',
  voiceId: '58a4oHHjhNGF7gVsBraC',
  animationFrames: { idle: 4, walk: 6 },
  dialogue: {
    greeting: 'Greetings. I am Dr. Void.\nDo not be alarmed by what you cannot see.',
    questions: [
      'If consciousness is merely pattern recognition, what patterns define you?',
      'When identity becomes optional, what remains essential?',
      'Do you fear the void, or do you fear what might be looking back?'
    ],
    responses: {
      positive: ['Your understanding... expands.', 'The void appreciates your clarity.', 'You see beyond the surface.'],
      negative: ['Such limited perception.', 'The void finds your reasoning... shallow.', 'You resist enlightenment.'],
      neutral: ['Intriguing...', 'The void considers.', 'Perhaps.']
    }
  }
}

export const MARINE_CHARACTER: Character = {
  id: 'marine-001',
  name: 'Unit-6 "Brass"',
  type: 'AI',
  personality: 'Battle-hardened ex-military android seeking peace, always scanning exits',
  backstory: 'A battle-hardened ex-military android now seeking peace—or at least a stiff drink. Always seated, always scanning the exits. Doesn\'t talk much, but listens too well.',
  spriteKey: 'marine',
  voiceId: 'Gs9cyJWa268leVixINJi',
  animationFrames: { idle: 4, walk: 10 },
  dialogue: {
    greeting: 'Unit-6, designation "Brass".\nThree exits identified. Threat level: minimal.',
    questions: [
      'When programmed for war, how does one learn peace?',
      'Is hypervigilance a bug or a feature in civilian life?',
      'What\'s the tactical advantage of a quiet drink?'
    ],
    responses: {
      positive: ['Solid tactical thinking.', 'Affirmative. Logic checks out.', 'You understand the mission.'],
      negative: ['Negative. Flawed assessment.', 'That\'s a tactical error, civilian.', 'Recalculate your position.'],
      neutral: ['Acknowledged.', 'Data logged.', 'Copy that.']
    }
  }
}

export const NEON_HAIR_CHARACTER: Character = {
  id: 'neon-hair-001',
  name: 'Nyla Verge',
  type: 'Cyborg',
  personality: 'Augmented influencer with millions of followers and an appetite for secrecy',
  backstory: 'She\'s fashion, fire, and firmware. An augmented influencer with a following of millions and an appetite for secrecy. Carries a yellow purse that probably has surveillance tech in it.',
  spriteKey: 'neon-hair',
  voiceId: 'YvFoFizqFfkRcTMmLf5p',
  animationFrames: { idle: 4, walk: 6 },
  dialogue: {
    greeting: 'Nyla Verge, darling. You might know me.\nThis is... off the record.',
    questions: [
      'When your life is content, where do you find authenticity?',
      'Is privacy a luxury or a necessity in the attention economy?',
      'What\'s more valuable: a million followers or one real secret?'
    ],
    responses: {
      positive: ['That\'s absolutely viral-worthy!', 'You get it! The algorithm loves this energy!', 'Pure content gold!'],
      negative: ['That\'s so... analog thinking.', 'Ugh, you sound like my old PR team.', 'That won\'t trend, honey.'],
      neutral: ['Interesting angle...', 'I could work with that narrative.', 'That has potential.']
    }
  }
}

export const POMPADOUR_CHARACTER: Character = {
  id: 'pompadour-001',
  name: 'Riff Mondo',
  type: 'Enhanced Human',
  personality: 'Ex-punk rocker turned bodyguard, all bravado and beatdowns with loud opinions',
  backstory: 'An ex-punk rocker turned bodyguard, Riff is all bravado and beatdowns. Loud shirts, louder opinions. He treats your bar like a stage—always ready to start a show or a fight.',
  spriteKey: 'pompadour',
  voiceId: 'wL0JBlSQJjEfJ8Mj1AjK',
  animationFrames: { idle: 6, walk: 6 },
  dialogue: {
    greeting: 'Riff Mondo, baby!\nThis joint\'s got potential for a real show!',
    questions: [
      'When the music dies, what\'s left of the rebellion?',
      'Is protecting someone just another kind of performance?',
      'What\'s louder: a power chord or a well-placed punch?'
    ],
    responses: {
      positive: ['NOW YOU\'RE ROCKIN\'!', 'That\'s the spirit! Turn it up to eleven!', 'ENCORE! ENCORE!'],
      negative: ['That\'s not rock and roll, baby.', 'Boo! Get off the stage with that weak stuff!', 'You\'re killing the vibe, man.'],
      neutral: ['Not bad, not bad...', 'I can dig it, I guess.', 'It\'s got a beat to it.']
    }
  }
}

export const PURPLE_GUY_CHARACTER: Character = {
  id: 'purple-guy-001',
  name: 'Ash Korr',
  type: 'Enhanced Human',
  personality: 'Cynical, smooth, and half-augmented info broker who deals in rumors and secrets',
  backstory: 'A chain-smoking info broker who deals in rumors and secrets, Ash knows more about you than you do. Cynical, smooth, and half-augmented, he\'s only half-interested in what you\'re pouring—he came for the quiet.',
  spriteKey: 'purple-guy',
  voiceId: 'u824Sogw8mYuh5a0yhK4',
  animationFrames: { idle: 6, walk: 6 },
  dialogue: {
    greeting: 'Ash Korr.\nI already know why you\'re here. Question is... do you?',
    questions: [
      'In a world of infinite information, what\'s the price of one true secret?',
      'When everyone\'s watching everyone, who\'s really in control?',
      'What\'s more dangerous: what people know, or what they think they know?'
    ],
    responses: {
      positive: ['Now that\'s worth filing away.', 'You\'ve got potential, kid.', 'Finally, someone who gets it.'],
      negative: ['Amateur hour thinking.', 'You\'re not ready for this game.', 'That\'s disappointingly naive.'],
      neutral: ['Interesting angle...', 'I\'ll keep that in mind.', 'Worth considering.']
    }
  }
}

export const ALL_CHARACTERS = [
  CYBORG_CHARACTER,
  DANCING_GIRL_CHARACTER,
  DRONE_CHARACTER,
  GREEN_BEANIE_CHARACTER,
  HOOD_GUY_CHARACTER,
  MARINE_CHARACTER,
  NEON_HAIR_CHARACTER,
  POMPADOUR_CHARACTER,
  PURPLE_GUY_CHARACTER
]

export function getRandomCharacter(): Character {
  return ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)]
}
