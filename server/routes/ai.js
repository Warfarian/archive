const express = require('express')
const router = express.Router()
const OpenAI = require('openai')
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js')

// Initialize Nebius client with timeout
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
  timeout: 10000, // 10 second timeout
})

// Initialize ElevenLabs client
const elevenlabs = process.env.ELEVENLABS_API_KEY ? new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
}) : null

// Generate question based on character
router.post('/generate-question', async (req, res) => {
  try {
    const { character } = req.body
    
    if (!process.env.NEBIUS_API_KEY) {
      console.log('No API key found, using fallback')
      const fallbackQuestion = character.dialogue?.questions?.[0] || 
        `Human, I am ${character.name}. In this world of endless data streams and synthetic emotions, I find myself questioning what it means to truly 'feel'. How do you, with your organic limitations, find meaning in such fleeting moments?`
      return res.json({ question: fallbackQuestion })
    }
    
    console.log(`Generating question for ${character.name}...`)
    
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      max_tokens: 200,
      temperature: 0.7,
      top_p: 0.95,
      messages: [
        {
          role: "system",
          content: `You are ${character.name}, a ${character.type} in the cyberpunk world of MEM//ORY. 
          
          Your personality: ${character.personality}
          Your backstory: ${character.backstory}
          
          You've entered The Archive, a hidden bar where the last unenhanced human offers wisdom and guidance to digital beings like yourself. You're seeking advice about the struggles of your enhanced/artificial existence.
          
          Generate ONE thoughtful, personal question that reflects your digital/enhanced nature and the existential problems you face. The question should be:
          - Personal and emotionally resonant
          - Related to the divide between human and artificial consciousness
          - Something only an unenhanced human could truly understand
          - Under 100 words
          - Spoken in your character's voice and personality
          
          Return ONLY the question, no additional text.`
        }
      ]
    })
    
    const question = response.choices[0].message.content.trim()
    console.log(`Generated question: ${question.substring(0, 50)}...`)
    res.json({ question })
    
  } catch (error) {
    console.error('AI Question Generation Error:', error.message)
    
    // Fallback to character-specific questions
    const fallbackQuestion = character.dialogue?.questions?.[0] || 
      `Human, I am ${character.name}. In this world of endless data streams and synthetic emotions, I find myself questioning what it means to truly 'feel'. How do you, with your organic limitations, find meaning in such fleeting moments?`
    
    res.json({ question: fallbackQuestion })
  }
})

// Evaluate user response
router.post('/evaluate-response', async (req, res) => {
  try {
    const { character, question, userResponse } = req.body
    
    if (!process.env.NEBIUS_API_KEY) {
      console.log('No API key found, using fallback evaluation')
      const mockEvaluation = {
        empathy: Math.floor(Math.random() * 4) + 6,
        wisdom: Math.floor(Math.random() * 4) + 6,
        connection: Math.floor(Math.random() * 4) + 6,
        authenticity: Math.floor(Math.random() * 4) + 6,
        characterReaction: "Your words resonate with something deep in my circuits... Thank you, human."
      }
      
      mockEvaluation.totalScore = Math.round(
        (mockEvaluation.empathy + mockEvaluation.wisdom + 
         mockEvaluation.connection + mockEvaluation.authenticity) / 4
      )
      
      return res.json(mockEvaluation)
    }
    
    console.log(`Evaluating response for ${character.name}...`)
    
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      max_tokens: 300,
      temperature: 0.3,
      top_p: 0.95,
      messages: [
        {
          role: "system",
          content: `You are an AI judge evaluating how well a human responds to questions from enhanced/artificial beings in the cyberpunk world of MEM//ORY.

          Character asking: ${character.name} (${character.type})
          Character's personality: ${character.personality}
          Question asked: "${question}"
          Human's response: "${userResponse}"
          
          Rate the human's response on these 4 dimensions (1-10 scale):
          
          1. EMPATHY: How well does the response show understanding and compassion for the character's digital/enhanced existence?
          2. WISDOM: How insightful and helpful is the advice given?
          3. CONNECTION: How well does the response bridge the gap between human and artificial consciousness?
          4. AUTHENTICITY: How genuine and true to human nature is the response (not trying to be artificially enhanced)?
          
          Also generate a brief character reaction (1-2 sentences) that ${character.name} would have to this response, staying true to their personality.
          
          Respond in this exact JSON format:
          {
            "empathy": [score 1-10],
            "wisdom": [score 1-10], 
            "connection": [score 1-10],
            "authenticity": [score 1-10],
            "characterReaction": "[reaction text]"
          }`
        }
      ]
    })
    
    const evaluation = JSON.parse(response.choices[0].message.content.trim())
    evaluation.totalScore = Math.round(
      (evaluation.empathy + evaluation.wisdom + evaluation.connection + evaluation.authenticity) / 4
    )
    
    console.log(`Evaluation complete: ${evaluation.totalScore}/10`)
    res.json(evaluation)
    
  } catch (error) {
    console.error('AI Evaluation Error:', error.message)
    
    // Fallback evaluation if AI fails
    const mockEvaluation = {
      empathy: Math.floor(Math.random() * 4) + 6, // 6-9 range
      wisdom: Math.floor(Math.random() * 4) + 6,
      connection: Math.floor(Math.random() * 4) + 6,
      authenticity: Math.floor(Math.random() * 4) + 6,
      characterReaction: "Your words resonate with something deep in my circuits... Thank you, human."
    }
    
    mockEvaluation.totalScore = Math.round(
      (mockEvaluation.empathy + mockEvaluation.wisdom + 
       mockEvaluation.connection + mockEvaluation.authenticity) / 4
    )
    
    res.json(mockEvaluation)
  }
})

// Generate speech from text using character's voice
router.post('/generate-speech', async (req, res) => {
  try {
    const { text, voiceId } = req.body
    
    if (!process.env.ELEVENLABS_API_KEY || !elevenlabs) {
      return res.status(503).json({ error: 'ElevenLabs API not configured' })
    }
    
    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Text and voiceId are required' })
    }
    
    console.log(`Generating speech for voice ${voiceId}: ${text.substring(0, 50)}...`)
    
    const audioStream = await elevenlabs.textToSpeech.stream(voiceId, {
      text: text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.8,
        style: 0.2,
        useSpeakerBoost: true,
        speed: 1.0
      }
    })
    
    // Collect audio chunks
    const chunks = []
    for await (const chunk of audioStream) {
      chunks.push(chunk)
    }
    
    const audioBuffer = Buffer.concat(chunks)
    
    // Set appropriate headers for audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    })
    
    res.send(audioBuffer)
    console.log(`Speech generated successfully for voice ${voiceId}`)
    
  } catch (error) {
    console.error('Speech Generation Error:', error.message)
    res.status(500).json({ error: 'Failed to generate speech' })
  }
})

module.exports = router
