# MEM//ORY - Cyberpunk Bar Game

A cyberpunk-themed interactive bar game built with React, Phaser, and Node.js.

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd archive
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

1. **Set up environment variables**
   
   Create a `.env` file in the `server/` directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/archive
   DB_NAME=archive
   NEBIUS_API_KEY=your_nebius_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

2. **Database Setup**
   - Make sure MongoDB is running locally, or
   - Use MongoDB Atlas and update the `MONGODB_URI` accordingly

### Running the Application

You'll need to run both the server and client in separate terminal windows:

1. **Start the server** (in one terminal)
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3001`

2. **Start the client** (in another terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Project Structure

- `client/` - React + Vite frontend with Phaser game engine
- `server/` - Express.js backend with MongoDB
- `client/public/assets/` - Game assets (sprites, sounds, backgrounds)

### Features

- Interactive cyberpunk bar environment
- Character interactions with AI-powered dialogue
- Jukebox with ambient music
- Score tracking system
- Animated NPCs with idle and walking states

### Development

- Client uses Vite for hot reloading
- Server uses nodemon for automatic restarts
- TypeScript support on the frontend
- ESLint configuration included
