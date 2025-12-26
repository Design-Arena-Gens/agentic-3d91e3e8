'use client'

import { useState, useRef, useEffect } from 'react'
import { Shuffle, Download, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface PlayerAttributes {
  gender: 'male' | 'female'
  skinTone: string
  hairStyle: string
  hairColor: string
  jerseyColor: string
  teamName: string
  position: string
  shirtNumber: number
}

export default function PlayerGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const [attributes, setAttributes] = useState<PlayerAttributes>({
    gender: 'male',
    skinTone: '#D4A574',
    hairStyle: 'short',
    hairColor: '#2C1810',
    jerseyColor: '#0066FF',
    teamName: 'UNITED',
    position: 'FW',
    shirtNumber: 10
  })

  const skinTones = ['#FDD8B5', '#D4A574', '#B87F4E', '#8D5524', '#5C3317']
  const hairStyles = ['short', 'medium', 'long', 'bald', 'curly']
  const hairColors = ['#000000', '#2C1810', '#6F4E37', '#B8860B', '#FFD700']
  const positions = ['GK', 'DF', 'MF', 'FW']

  useEffect(() => {
    generatePlayer()
  }, [attributes])

  const generatePlayer = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1A1F3A')
    gradient.addColorStop(1, '#0A0E27')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw player silhouette
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 + 40

    // Head
    ctx.beginPath()
    ctx.arc(centerX, centerY - 100, 40, 0, Math.PI * 2)
    ctx.fillStyle = attributes.skinTone
    ctx.fill()

    // Hair
    if (attributes.hairStyle !== 'bald') {
      ctx.beginPath()
      ctx.fillStyle = attributes.hairColor

      switch (attributes.hairStyle) {
        case 'short':
          ctx.arc(centerX, centerY - 110, 42, Math.PI, Math.PI * 2)
          break
        case 'medium':
          ctx.arc(centerX, centerY - 115, 45, Math.PI, Math.PI * 2)
          break
        case 'long':
          ctx.ellipse(centerX, centerY - 110, 45, 55, 0, Math.PI, Math.PI * 2)
          break
        case 'curly':
          for (let i = 0; i < 5; i++) {
            ctx.arc(centerX - 30 + i * 15, centerY - 120, 12, 0, Math.PI * 2)
          }
          break
      }
      ctx.fill()
    }

    // Jersey
    ctx.fillStyle = attributes.jerseyColor
    ctx.beginPath()
    ctx.moveTo(centerX - 60, centerY - 60)
    ctx.lineTo(centerX + 60, centerY - 60)
    ctx.lineTo(centerX + 70, centerY + 40)
    ctx.lineTo(centerX - 70, centerY + 40)
    ctx.closePath()
    ctx.fill()

    // Sleeves
    ctx.beginPath()
    ctx.moveTo(centerX - 60, centerY - 60)
    ctx.lineTo(centerX - 100, centerY - 40)
    ctx.lineTo(centerX - 90, centerY + 20)
    ctx.lineTo(centerX - 70, centerY + 10)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(centerX + 60, centerY - 60)
    ctx.lineTo(centerX + 100, centerY - 40)
    ctx.lineTo(centerX + 90, centerY + 20)
    ctx.lineTo(centerX + 70, centerY + 10)
    ctx.closePath()
    ctx.fill()

    // Arms (skin)
    ctx.fillStyle = attributes.skinTone
    ctx.beginPath()
    ctx.arc(centerX - 95, centerY - 10, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + 95, centerY - 10, 15, 0, Math.PI * 2)
    ctx.fill()

    // Jersey number
    ctx.fillStyle = 'white'
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(attributes.shirtNumber.toString(), centerX, centerY)

    // Position badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(centerX - 30, centerY + 50, 60, 25)
    ctx.fillStyle = attributes.jerseyColor
    ctx.font = 'bold 16px Arial'
    ctx.fillText(attributes.position, centerX, centerY + 68)

    // Team name
    ctx.fillStyle = 'white'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(attributes.teamName, centerX, centerY - 70)

    // Shorts
    ctx.fillStyle = attributes.jerseyColor
    ctx.globalAlpha = 0.8
    ctx.fillRect(centerX - 50, centerY + 40, 100, 60)
    ctx.globalAlpha = 1.0

    // Legs
    ctx.fillStyle = attributes.skinTone
    ctx.fillRect(centerX - 40, centerY + 100, 30, 80)
    ctx.fillRect(centerX + 10, centerY + 100, 30, 80)

    // Socks
    ctx.fillStyle = attributes.jerseyColor
    ctx.fillRect(centerX - 40, centerY + 160, 30, 40)
    ctx.fillRect(centerX + 10, centerY + 160, 30, 40)

    // Shoes
    ctx.fillStyle = '#1A1A1A'
    ctx.fillRect(centerX - 45, centerY + 195, 35, 15)
    ctx.fillRect(centerX + 10, centerY + 195, 35, 15)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    generatePlayer()

    setTimeout(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const imageUrl = canvas.toDataURL('image/png')
        setGeneratedImages(prev => [imageUrl, ...prev].slice(0, 6))
      }
      setIsGenerating(false)
    }, 800)
  }

  const randomizeAttributes = () => {
    setAttributes({
      gender: Math.random() > 0.5 ? 'male' : 'female',
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      jerseyColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      teamName: ['UNITED', 'CITY', 'ROVERS', 'ATHLETIC', 'REAL', 'FC'][Math.floor(Math.random() * 6)],
      position: positions[Math.floor(Math.random() * positions.length)],
      shirtNumber: Math.floor(Math.random() * 99) + 1
    })
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = `player-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Canvas Preview */}
      <div className="space-y-4">
        <div className="bg-dark rounded-lg p-6 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={600}
            className="max-w-full h-auto rounded-lg shadow-2xl"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            <Sparkles size={20} />
            {isGenerating ? 'Generating...' : 'Generate Player'}
          </button>
          <button
            onClick={randomizeAttributes}
            className="px-6 py-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Shuffle size={20} />
          </button>
          <button
            onClick={downloadImage}
            className="px-6 py-3 bg-dark-light rounded-lg hover:bg-dark transition-colors"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Customize Player</h3>

        {/* Skin Tone */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Skin Tone</label>
          <div className="flex gap-2">
            {skinTones.map(tone => (
              <button
                key={tone}
                onClick={() => setAttributes({...attributes, skinTone: tone})}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  attributes.skinTone === tone ? 'border-primary scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: tone }}
              />
            ))}
          </div>
        </div>

        {/* Hair Style */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Hair Style</label>
          <div className="flex gap-2 flex-wrap">
            {hairStyles.map(style => (
              <button
                key={style}
                onClick={() => setAttributes({...attributes, hairStyle: style})}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  attributes.hairStyle === style
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-dark/80'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Hair Color</label>
          <div className="flex gap-2">
            {hairColors.map(color => (
              <button
                key={color}
                onClick={() => setAttributes({...attributes, hairColor: color})}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  attributes.hairColor === color ? 'border-primary scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Jersey Color */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Jersey Color</label>
          <input
            type="color"
            value={attributes.jerseyColor}
            onChange={(e) => setAttributes({...attributes, jerseyColor: e.target.value})}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>

        {/* Team Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Team Name</label>
          <input
            type="text"
            value={attributes.teamName}
            onChange={(e) => setAttributes({...attributes, teamName: e.target.value.toUpperCase()})}
            maxLength={10}
            className="w-full px-4 py-2 bg-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Position</label>
          <div className="flex gap-2">
            {positions.map(pos => (
              <button
                key={pos}
                onClick={() => setAttributes({...attributes, position: pos})}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  attributes.position === pos
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-dark/80'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Shirt Number */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Shirt Number</label>
          <input
            type="number"
            value={attributes.shirtNumber}
            onChange={(e) => setAttributes({...attributes, shirtNumber: Math.max(1, Math.min(99, parseInt(e.target.value) || 1))})}
            min="1"
            max="99"
            className="w-full px-4 py-2 bg-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Recent Generations</h4>
            <div className="grid grid-cols-3 gap-2">
              {generatedImages.map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img}
                  alt={`Generated player ${idx + 1}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `player-${idx}.png`
                    link.href = img
                    link.click()
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
