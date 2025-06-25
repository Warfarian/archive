const express = require('express')
const router = express.Router()
const Character = require('../models/Character')

// Get all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find()
    res.json(characters)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get random character
router.get('/random', async (req, res) => {
  try {
    const count = await Character.countDocuments()
    const random = Math.floor(Math.random() * count)
    const character = await Character.findOne().skip(random)
    res.json(character)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new character
router.post('/', async (req, res) => {
  try {
    const character = new Character(req.body)
    await character.save()
    res.status(201).json(character)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
