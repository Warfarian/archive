const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  characterId: String,
  question: String,
  userResponse: String,
  aiEvaluation: {
    empathy: Number,
    wisdom: Number,
    connection: Number,
    authenticity: Number,
    totalScore: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  visitorId: {
    type: String,
    required: true
  },
  conversations: [conversationSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date
}, {
  timestamps: true
})

module.exports = mongoose.model('Session', sessionSchema)
