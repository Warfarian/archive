const express = require('express')
const router = express.Router()
const Session = require('../models/Session')

// Create new session
router.post('/', async (req, res) => {
  try {
    const { visitorId } = req.body
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session = new Session({
      sessionId,
      visitorId
    })
    
    await session.save()
    res.status(201).json(session)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get session by ID
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add conversation to session
router.post('/:sessionId/conversations', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    session.conversations.push(req.body)
    session.totalScore += req.body.aiEvaluation?.totalScore || 0
    await session.save()
    
    res.json(session)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
