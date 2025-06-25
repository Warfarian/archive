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

  create() {
    const width = this.game.config.width as number
    const height = this.game.config.height as number
    
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
    
    // Add title text with pixel art styling
    const title = this.add.text(960, 200, 'THE ARCHIVE', {
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
      color: '#ff00ff',
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
      startButton.setColor('#ff00ff')
    })
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
    
    // Create VA-11 Hall-A inspired dialogue box - clean and minimal
    const speechBubble = this.add.graphics()
    
    // Main dialogue background - dark with transparency like VA-11 Hall-A
    speechBubble.fillStyle(0x000000, 0.85)
    speechBubble.fillRect(-480, -120, 960, 200)
    
    // Simple border - clean lines with purple color
    speechBubble.lineStyle(3, 0xff00ff, 1)
    speechBubble.strokeRect(-480, -120, 960, 200)
    
    // Inner accent line
    speechBubble.lineStyle(1, 0xaa00aa, 0.8)
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
      color: '#00ffff',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const greetingText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    const continueBtn = this.add.text(400, 50, '▶ CONTINUE', {
      fontSize: '18px',
      color: '#ffff00',
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
      continueBtn.setTint(0xff00ff)
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

  private showQuestion() {
    if (!this.dialogueBox || this.currentQuestionIndex >= this.currentCharacter.dialogue.questions.length) {
      this.endConversation()
      return
    }
    
    this.dialogueBox.removeAll(true)
    this.createDialogueBox()
    
    const question = this.currentCharacter.dialogue.questions[this.currentQuestionIndex]
    
    const nameText = this.add.text(-450, -100, this.currentCharacter.name, {
      fontSize: '32px',
      color: '#00ffff',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const questionText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    const responsePrompt = this.add.text(-450, 20, '💭 [Your response will appear here]', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Orbitron',
      align: 'left',
      fontStyle: 'italic'
    }).setOrigin(0, 0)
    
    const nextBtn = this.add.text(400, 50, '▶ NEXT', {
      fontSize: '18px',
      color: '#00ff00',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(1, 0)
    .setInteractive()
    .on('pointerdown', () => {
      this.playSelectSound()
      this.currentQuestionIndex++
      this.showQuestion()
    })
    .on('pointerover', () => {
      this.playHoverSound()
      nextBtn.setTint(0x00ffff)
      nextBtn.setScale(1.1)
    })
    .on('pointerout', () => {
      nextBtn.clearTint()
      nextBtn.setScale(1.0)
    })
    
    this.dialogueBox.add([nameText, questionText, responsePrompt, nextBtn])
    
    // Start typewriter effect for question
    this.typewriterText(questionText, question, 30)
  }

  private endConversation() {
    if (!this.dialogueBox) return
    
    this.dialogueBox.removeAll(true)
    this.createDialogueBox()
    
    const nameText = this.add.text(-450, -100, this.currentCharacter.name, {
      fontSize: '32px',
      color: '#00ffff',
      fontFamily: 'Press Start 2P',
      fontStyle: 'bold'
    }).setOrigin(0, 0)
    
    const farewellText = this.add.text(-450, -50, '', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Orbitron',
      align: 'left',
      wordWrap: { width: 900 },
      lineSpacing: 8
    }).setOrigin(0, 0)
    
    // Add character exit animation
    const exitBtn = this.add.text(400, 50, '👋 FAREWELL', {
      fontSize: '18px',
      color: '#ff8000',
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
      exitBtn.setTint(0xffff00)
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
        this.restartScene()
      }
    })
  }

  private restartScene() {
    this.currentQuestionIndex = 0
    this.isCharacterWalking = false
    this.currentNPC?.destroy()
    this.dialogueBox?.destroy()
    this.currentCharacter = getRandomCharacter() // Select new random character
    this.scene.restart()
  }
}
