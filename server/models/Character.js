const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['AI', 'Cyborg', 'Rogue Program', 'Enhanced Human'],
    required: true
  },
  personality: {
    type: String,
    required: true
  },
  backstory: {
    type: String,
    required: true
  },
  spriteKey: {
    type: String,
    required: true
  },
  voiceId: {
    type: String,
    required: false
  },
  difficulty: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Character', characterSchema)
