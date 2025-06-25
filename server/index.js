const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/characters', require('./routes/characters'))
app.use('/api/sessions', require('./routes/sessions'))
app.use('/api/ai', require('./routes/ai'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'The Archive server is running' })
})

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'the-archive'
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))
} else {
  console.log('MongoDB URI not provided, running without database')
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
