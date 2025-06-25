import { Scene } from 'phaser'
import { ALL_CHARACTERS, getRandomCharacter, Character } from '../types/Character'

export class BarScene extends Scene {
  private currentNPC?: Phaser.GameObjects.Sprite
  private isCharacterWalking = false
  private currentCharacter: Character
  private dialogueBox?: Phaser.GameObjects.Container
  private currentQuestionIndex = 0
  private soundEnabled = false
  private dialogueSoundIndex = 0
  private pregeneratedQuestions: Map<string, string> = new Map()

  constructor() {
    super({ key: 'BarScene' })
    this.currentCharacter = getRandomCharacter()
  }

  init(data: { soundEnabled?: boolean }) {
    this.soundEnabled = data.soundEnabled || false
  }

  preload() {
    // Load video background
    this.load.video('bar-bg', 'assets/background/cyberpunk-bar-pixel-moewalls-com.mp4')
    
    // Load audio files
    this.load.audio('hover-sound', 'assets/sounds/effects/hover.mp3')
    this.load.audio('select-sound', 'assets/sounds/effects/select.mp3')
    this.load.audio('bell-sound', 'assets/sounds/effects/bell.mp3')
    
    // Load dialogue sound files
    this.load.audio('dialogue-long-1', 'assets/sounds/effects/dialogue-long-1.mp3')
    this.load.audio('dialogue-long-2', 'assets/sounds/effects/dialogue-long-2.mp3')
    this.load.audio('dialogue-short-1', 'assets/sounds/effects/dialogue-short-1.mp3')
    this.load.audio('dialogue-short-2', 'assets/sounds/effects/dialogue-short-2.mp3')
    
    // Load all NPC assets
    ALL_CHARACTERS.forEach(character => {
      const spriteKey = character.spriteKey
      
      // Load idle animation frames
      for (let i = 0; i < character.animationFrames.idle; i++) {
        const frameNum = this.getFrameNumber(spriteKey, i, 'idle')
        this.load.image(`${spriteKey}-idle-${frameNum}`, `assets/npcs/${spriteKey}/${spriteKey}-idle/${spriteKey}-idle-${frameNum}.png`)
      }
      
      // Load walk animation frames
      for (let i = 0; i < character.animationFrames.walk; i++) {
        const frameNum = this.getFrameNumber(spriteKey, i, 'walk')
        this.load.image(`${spriteKey}-walk-${frameNum}`, `assets/npcs/${spriteKey}/${spriteKey}-walk/${spriteKey}-walk-${frameNum}.png`)
      }
    })
  }

  private getFrameNumber(spriteKey: string, index: number, animType: string): string {
    // Handle different naming conventions
    if (spriteKey === 'dancing-girl') {
      return (index + 1).toString()
    } else if (spriteKey === 'marine') {
      return (index + 1).toString().padStart(2, '0')
    } else {
      return index.toString().padStart(3, '0')
    }
  }

  async create() {
    const width = this.game.config.width as number
    const height = this.game.config.height as number
    
    // Emit loading start event
    this.game.events.emit('loadingStart')
    
    // Pregenerate questions for all characters
    await this.pregenerateQuestions()
    
    // Emit loading complete event
    this.game.events.emit('loadingComplete')
    
    // Add cyberpunk bar background
    const bg = this.add.video(width / 2, height / 2, 'bar-bg')
    bg.setOrigin(0.5)
    bg.setDepth(0)
    bg.play(true)
    
    bg.on('playing', () => {
      const video = bg.video
      if (video && video.videoWidth && video.videoHeight) {
        const scaleX = width / video.videoWidth
        const scaleY = height / video.videoHeight
        const scale = Math.max(scaleX, scaleY)
        bg.setScale(scale)
      } else {
        bg.setDisplaySize(width, height)
      }
    })
    
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)')
    
    // Create animations for all characters
    this.createAllAnimations()
    
    // Add title text with pixel art styling - Updated to MEM//ORY
    const title = this.add.text(960, 200, 'MEM//ORY', {
      fontSize: '72px',
      color: '#00ffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setName('title')
    
    const subtitle = this.add.text(960, 300, 'Last Human in the Sector', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setName('subtitle')
    
    const startButton = this.add.text(960, 600, '> PRESS TO BEGIN <', {
      fontSize: '36px',
      color: '#00ff00',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setName('startButton')
    .setInteractive()
    .on('pointerdown', () => {
      this.playSelectSound()
      this.startCharacterScene()
    })
    .on('pointerover', () => {
      this.playHoverSound()
      startButton.setColor('#ffff00')
    })
    .on('pointerout', () => {
      startButton.setColor('#00ff00')
    })
  }

  private async pregenerateQuestions() {
    console.log('Pregenerating questions for all characters...')
    
    for (const character of ALL_CHARACTERS) {
      try {
        const response = await fetch('/api/ai/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character })
        })
        
        if (response.ok) {
          const data = await response.json()
          this.pregeneratedQuestions.set(character.id, data.question)
          console.log(`Generated question for ${character.name}`)
        } else {
          // Use fallback question
          const fallback = character.dialogue?.questions?.[0] || 
            "Human, in this world of endless data streams, how do you find meaning in such fleeting moments?"
          this.pregeneratedQuestions.set(character.id, fallback)
          console.log(`Using fallback question for ${character.name}`)
        }
      } catch (error) {
        console.error(`Failed to generate question for ${character.name}:`, error)
        // Use fallback question
        const fallback = character.dialogue?.questions?.[0] || 
          "Human, in this world of endless data streams, how do you find meaning in such fleeting moments?"
        this.pregeneratedQuestions.set(character.id, fallback)
      }
    }
    
    console.log('Question pregeneration complete!')
  }

  private playHoverSound() {
    if (this.soundEnabled) {
      this.sound.play('hover-sound', { volume: 0.3 })
    }
  }

  private playSelectSound() {
    if (this.soundEnabled) {
      this.sound.play('select-sound', { volume: 0.5 })
    }
  }

  private playDialogueSound(text: string) {
    if (!this.soundEnabled) {
      console.log('Sound disabled, not playing dialogue sound')
      return
    }
    
    console.log('Playing dialogue sound for:', text.substring(0, 30) + '...')
    
    try {
      // Choose dialogue sound based on text length and alternate between sounds
      const isLongText = text.length > 50
      const soundType = isLongText ? 'long' : 'short'
      const soundNumber = (this.dialogueSoundIndex % 2) + 1
      const soundKey = `dialogue-${soundType}-${soundNumber}`
      
      this.sound.play(soundKey, { volume: 0.6 })
      this.dialogueSoundIndex++
      
      console.log(`Dialogue sound played: ${soundKey}`)
    } catch (error) {
      console.error('Error playing dialogue sound:', error)
    }
  }

  private createAllAnimations() {
    ALL_CHARACTERS.forEach(character => {
      const spriteKey = character.spriteKey
      
      // Create walk animation
      const walkFrames = []
      for (let i = 0; i < character.animationFrames.walk; i++) {
        const frameNum = this.getFrameNumber(spriteKey, i, 'walk')
        walkFrames.push({ key: `${spriteKey}-walk-${frameNum}` })
      }
      
      this.anims.create({
        key: `${spriteKey}-walk`,
        frames: walkFrames,
        frameRate: 10,
        repeat: -1
      })
      
      // Create idle animation
      const idleFrames = []
      for (let i = 0; i < character.animationFrames.idle; i++) {
        const frameNum = this.getFrameNumber(spriteKey, i, 'idle')
        idleFrames.push({ key: `${spriteKey}-idle-${frameNum}` })
      }
      
      this.anims.create({
        key: `${spriteKey}-idle`,
        frames: idleFrames,
        frameRate: 8,
        repeat: -1
      })
    })
  }

  private startCharacterScene() {
    if (this.isCharacterWalking) return
    
    this.isCharacterWalking = true
    
    // Emit game started event on first patron
    this.game.events.emit('gameStarted')
    
    // Play bell sound when patron arrives
    if (this.soundEnabled) {
      this.sound.play('bell-sound', { volume: 0.4 })
    }
    
    // Hide UI elements
    this.children.getByName('title')?.setVisible(false)
    this.children.getByName('subtitle')?.setVisible(false)
    this.children.getByName('startButton')?.setVisible(false)
    
    // Add current character sprite starting from left side
    const spriteKey = this.currentCharacter.spriteKey
    const firstWalkFrame = `${spriteKey}-walk-${this.getFrameNumber(spriteKey, 0, 'walk')}`
    
    this.currentNPC = this.add.sprite(-100, 800, firstWalkFrame)
    this.currentNPC.setScale(8)
    this.currentNPC.setFlipX(false) // Don't flip - sprites naturally face right
    this.currentNPC.setDepth(10)
    this.currentNPC.play(`${spriteKey}-walk`)
    
    // Animate character walking to bar stool position
    this.tweens.add({
      targets: this.currentNPC,
      x: 700,
      duration: 3000,
      ease: 'Linear',
      onComplete: () => {
        this.currentNPC?.play(`${spriteKey}-idle`)
        this.startDialogue()
      }
    })
  }

  private startDialogue() {
    this.createDialogueBox()
    this.showGreeting()
  }

  private createDialogueBox() {
    // Move dialogue box to middle-upper area of screen
    this.dialogueBox = this.add.container(960, 400)
    
    // Create VA-11 Hall-A inspired dialogue box with neo-noir colors
    const speechBubble = this.add.graphics()
    
    // Main dialogue background - deep space navy
    speechBubble.fillStyle(0x1A1D2E, 0.95)
    speechBubble.fillRect(-480, -120, 960, 200)
    
    // Cyber aqua blue outline glow
    speechBubble.lineStyle(3, 0x7DF9FF, 1)
    speechBubble.strokeRect(-480, -120, 960, 200)
    
    // Inner accent line
    speechBubble.lineStyle(1, 0x4CFFD9, 0.8)
    speechBubble.strokeRect(-475, -115, 950, 190)
    
    this.dialogueBox.add(speechBubble)
  }

  private typewriterText(textObject: Phaser.GameObjects.Text, fullText: string, speed: number = 50) {
    if (!textObject || !fullText) return
    
    // Play dialogue sound when starting to type
    this.playDialogueSound(fullText)
    
    textObject.setText('')
    let currentIndex = 0
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length && textObject && textObject.active) {
        textObject.setText(fullText.substring(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeNextChar, speed)
      }
    }
    
    typeNextChar()
  }

  private showGreeting() {
    if (!this.dialogueBox) return
    
    this.dialogueBox.removeAll(true)
    this.createDialogueBox()
    
    const nameText = this.add.text(-450, -100, this.currentCharacter.name, {
      fontSize: '32px',
      color: '#FF8F00',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const greetingText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#F0F0F0',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    const continueBtn = this.add.text(400, 50, '▶ CONTINUE', {
      fontSize: '18px',
      color: '#7DF9FF',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(1, 0)
    .setInteractive()
    .on('pointerdown', () => {
      this.playSelectSound()
      this.showQuestion()
    })
    .on('pointerover', () => {
      this.playHoverSound()
      continueBtn.setTint(0x4CFFD9)
      continueBtn.setScale(1.1)
    })
    .on('pointerout', () => {
      continueBtn.clearTint()
      continueBtn.setScale(1.0)
    })
    
    this.dialogueBox.add([nameText, greetingText, continueBtn])
    
    // Start typewriter effect for greeting
    this.typewriterText(greetingText, this.currentCharacter.dialogue.greeting, 25)
    
    console.log(`${this.currentCharacter.name} has arrived and is ready to talk!`)
  }

  private async showQuestion() {
    if (!this.dialogueBox) return
    
    this.dialogueBox.removeAll(true)
    this.createDialogueBox()
    
    // Use pregenerated question instead of generating on-demand
    const question = this.pregeneratedQuestions.get(this.currentCharacter.id) || 
      "Human, in this world of endless data streams, how do you find meaning in such fleeting moments?"
    
    const nameText = this.add.text(-450, -100, this.currentCharacter.name, {
      fontSize: '32px',
      color: '#FF8F00',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const questionText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#F0F0F0',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    this.dialogueBox.add([nameText, questionText])
    
    // Start typewriter effect for question
    this.typewriterText(questionText, question, 30)
    
    // Add text input box after a delay
    setTimeout(() => {
      this.showResponseInput(question)
    }, question.length * 30 + 500) // Wait for typewriter to finish
  }

  private showResponseInput(question: string) {
    // Create HTML input overlay for user response - positioned at bottom of screen
    const inputContainer = document.createElement('div')
    inputContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1A1D2E;
      border: 4px solid #7DF9FF;
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      font-family: 'Orbitron', monospace;
      color: #F0F0F0;
      width: 90%;
      max-width: 800px;
      box-shadow: 
        0 0 30px rgba(125, 249, 255, 0.5),
        inset 0 0 20px rgba(125, 249, 255, 0.1);
    `
    
    const prompt = document.createElement('div')
    prompt.textContent = 'Your response:'
    prompt.style.cssText = `
      margin-bottom: 10px; 
      color: #F0F0F0; 
      font-size: 16px;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(240, 240, 240, 0.5);
    `
    
    const textarea = document.createElement('textarea')
    textarea.style.cssText = `
      width: 100%;
      height: 80px;
      background: #262B44;
      border: 3px solid #7DF9FF;
      border-radius: 6px;
      color: #F0F0F0;
      font-family: 'Orbitron', monospace;
      font-size: 14px;
      padding: 10px;
      resize: none;
      outline: none;
      line-height: 1.4;
      box-shadow: 
        inset 0 0 10px rgba(125, 249, 255, 0.2),
        0 0 15px rgba(125, 249, 255, 0.3);
      transition: all 0.3s ease;
    `
    textarea.placeholder = 'Share your human wisdom and perspective...'
    
    // Add focus effects
    textarea.addEventListener('focus', () => {
      textarea.style.borderColor = '#4CFFD9'
      textarea.style.boxShadow = `
        inset 0 0 15px rgba(76, 255, 217, 0.3),
        0 0 20px rgba(76, 255, 217, 0.4)
      `
    })
    
    textarea.addEventListener('blur', () => {
      textarea.style.borderColor = '#7DF9FF'
      textarea.style.boxShadow = `
        inset 0 0 10px rgba(125, 249, 255, 0.2),
        0 0 15px rgba(125, 249, 255, 0.3)
      `
    })
    
    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = `
      display: flex; 
      gap: 15px; 
      margin-top: 15px; 
      justify-content: flex-end;
    `
    
    const submitBtn = document.createElement('button')
    submitBtn.textContent = 'SUBMIT'
    submitBtn.style.cssText = `
      background: #00FFC2;
      border: 2px solid #4CFFD9;
      border-radius: 4px;
      color: #000000;
      padding: 10px 20px;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-shadow: none;
      box-shadow: 0 4px 15px rgba(0, 255, 194, 0.4);
    `
    
    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = 'CANCEL'
    cancelBtn.style.cssText = `
      background: #3A3F5C;
      border: 2px solid #CCCCCC;
      border-radius: 4px;
      color: #CCCCCC;
      padding: 10px 20px;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(58, 63, 92, 0.4);
    `
    
    // Add hover effects
    submitBtn.addEventListener('mouseenter', () => {
      submitBtn.style.transform = 'translateY(-2px)'
      submitBtn.style.boxShadow = '0 6px 20px rgba(76, 255, 217, 0.6)'
      submitBtn.style.background = '#4CFFD9'
    })
    
    submitBtn.addEventListener('mouseleave', () => {
      submitBtn.style.transform = 'translateY(0)'
      submitBtn.style.boxShadow = '0 4px 15px rgba(0, 255, 194, 0.4)'
      submitBtn.style.background = '#00FFC2'
    })
    
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.transform = 'translateY(-2px)'
      cancelBtn.style.boxShadow = '0 6px 20px rgba(58, 63, 92, 0.6)'
    })
    
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.transform = 'translateY(0)'
      cancelBtn.style.boxShadow = '0 4px 15px rgba(58, 63, 92, 0.4)'
    })
    
    // Handle Enter key for submission
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault()
        submitBtn.click()
      }
    })
    
    submitBtn.onclick = () => {
      const response = textarea.value.trim()
      if (response) {
        document.body.removeChild(inputContainer)
        this.evaluateResponse(question, response)
      }
    }
    
    cancelBtn.onclick = () => {
      document.body.removeChild(inputContainer)
      this.endConversation()
    }
    
    buttonContainer.appendChild(cancelBtn)
    buttonContainer.appendChild(submitBtn)
    inputContainer.appendChild(prompt)
    inputContainer.appendChild(textarea)
    inputContainer.appendChild(buttonContainer)
    document.body.appendChild(inputContainer)
    
    textarea.focus()
  }

  private async evaluateResponse(question: string, userResponse: string) {
    try {
      const response = await fetch('/api/ai/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          character: this.currentCharacter,
          question,
          userResponse 
        })
      })
      
      const evaluation = await response.json()
      this.showEvaluation(evaluation)
      
      // Emit score update to parent App component
      this.game.events.emit('scoreUpdate', evaluation.totalScore)
      
    } catch (error) {
      console.error('Failed to evaluate response:', error)
      this.endConversation()
    }
  }

  private showEvaluation(evaluation: any) {
    if (!this.dialogueBox) return
    
    this.dialogueBox.removeAll(true)
    this.createDialogueBox()
    
    const nameText = this.add.text(-450, -100, this.currentCharacter.name, {
      fontSize: '32px',
      color: '#FF8F00',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const reactionText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#F0F0F0',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    const continueBtn = this.add.text(400, 50, '▶ NEXT PATRON', {
      fontSize: '18px',
      color: '#7DF9FF',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(1, 0)
    .setInteractive()
    .on('pointerdown', () => {
      this.playSelectSound()
      this.nextPatron()
    })
    .on('pointerover', () => {
      this.playHoverSound()
      continueBtn.setTint(0x4CFFD9)
      continueBtn.setScale(1.1)
    })
    .on('pointerout', () => {
      continueBtn.clearTint()
      continueBtn.setScale(1.0)
    })
    
    this.dialogueBox.add([nameText, reactionText, continueBtn])
    
    // Start typewriter effect for character reaction
    this.typewriterText(reactionText, evaluation.characterReaction, 25)
  }

  private nextPatron() {
    // Character exits and new one enters without restarting scene
    this.characterExit()
  }

  private characterExit() {
    if (!this.currentNPC) return
    
    this.dialogueBox?.destroy()
    
    // Switch to walk animation and flip to face left (walking out)
    const spriteKey = this.currentCharacter.spriteKey
    this.currentNPC.play(`${spriteKey}-walk`)
    this.currentNPC.setFlipX(true) // Flip to face left when walking out
    
    // Animate character walking out to the left
    this.tweens.add({
      targets: this.currentNPC,
      x: -200,
      duration: 3000,
      ease: 'Linear',
      onComplete: () => {
        this.prepareNextPatron()
      }
    })
  }

  private prepareNextPatron() {
    // Clean up current patron
    this.currentNPC?.destroy()
    this.dialogueBox?.destroy()
    
    // Reset state for next patron
    this.currentQuestionIndex = 0
    this.isCharacterWalking = false
    this.currentCharacter = getRandomCharacter()
    
    // Show title screen again for next patron
    this.children.getByName('title')?.setVisible(true)
    this.children.getByName('subtitle')?.setVisible(true)
    this.children.getByName('startButton')?.setVisible(true)
  }

  private endConversation() {
    if (!this.dialogueBox) return
    
    this.dialogueBox.removeAll(true)
    this.createDialogueBox()
    
    const nameText = this.add.text(-450, -100, this.currentCharacter.name, {
      fontSize: '32px',
      color: '#FF8F00',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const farewellText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#F0F0F0',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    const exitBtn = this.add.text(400, 50, '👋 FAREWELL', {
      fontSize: '18px',
      color: '#7DF9FF',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(1, 0)
    .setInteractive()
    .on('pointerdown', () => {
      this.playSelectSound()
      this.characterExit()
    })
    .on('pointerover', () => {
      this.playHoverSound()
      exitBtn.setTint(0x4CFFD9)
      exitBtn.setScale(1.1)
    })
    .on('pointerout', () => {
      exitBtn.clearTint()
      exitBtn.setScale(1.0)
    })
    
    this.dialogueBox.add([nameText, farewellText, exitBtn])
    
    // Start typewriter effect for farewell
    this.typewriterText(farewellText, 'Thank you for the conversation, human.\nYour perspective is... enlightening.', 25)
  }

  update() {
    // Check for sound state updates from App component
    const newSoundEnabled = this.data.get('soundEnabled')
    if (newSoundEnabled !== undefined && newSoundEnabled !== this.soundEnabled) {
      this.soundEnabled = newSoundEnabled
    }
  }
}
