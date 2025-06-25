const express = require('express')
const router = express.Router()
const axios = require('axios')

// Generate question based on character
router.post('/generate-question', async (req, res) => {
  try {
    const { character } = req.body
    
    if (!process.env.NEBIUS_API_KEY) {
      return res.status(500).json({ error: 'Nebius API key not configured' })
    }
    
    const prompt = `You are ${character.name}, a ${character.type} in a cyberpunk dystopian future. 
    Your personality: ${character.personality}
    Your backstory: ${character.backstory}
    
    You've entered The Archive, a hidden bar where the last unenhanced human offers wisdom and guidance. 
    Ask them a question that reflects your digital/enhanced existence and the problems you face in this world. 
    Keep it under 100 words and make it personal and engaging.`
    
    // Placeholder response for now - replace with actual Nebius API call
    const mockResponse = {
      question: `Human, I am ${character.name}. In this world of endless data streams and synthetic emotions, I find myself questioning what it means to truly 'feel'. My enhanced neural pathways process millions of calculations per second, yet I cannot understand the weight of a single tear. How do you, with your organic limitations, find meaning in such fleeting moments?`
    }
    
    res.json(mockResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Evaluate user response
router.post('/evaluate-response', async (req, res) => {
  try {
    const { character, question, userResponse } = req.body
    
    // Placeholder evaluation - replace with actual AI evaluation
    const mockEvaluation = {
      empathy: Math.floor(Math.random() * 10) + 1,
      wisdom: Math.floor(Math.random() * 10) + 1,
      connection: Math.floor(Math.random() * 10) + 1,
      authenticity: Math.floor(Math.random() * 10) + 1
    }
    
    mockEvaluation.totalScore = Math.round(
      (mockEvaluation.empathy + mockEvaluation.wisdom + 
       mockEvaluation.connection + mockEvaluation.authenticity) / 4
    )
    
    res.json(mockEvaluation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
