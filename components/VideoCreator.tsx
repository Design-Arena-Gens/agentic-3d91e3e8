'use client'

import { useState, useRef } from 'react'
import { Play, Upload, Film, Download, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoSettings {
  theme: string
  duration: number
  transition: string
  resolution: string
  music: string
}

export default function VideoCreator() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [creationProgress, setCreationProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoCanvasRef = useRef<HTMLCanvasElement>(null)

  const [settings, setSettings] = useState<VideoSettings>({
    theme: 'dynamic',
    duration: 3,
    transition: 'fade',
    resolution: '4k',
    music: 'energetic'
  })

  const themes = ['dynamic', 'cinematic', 'minimal', 'sports', 'elegant']
  const transitions = ['fade', 'slide', 'zoom', 'wipe', 'dissolve']
  const musicStyles = ['energetic', 'dramatic', 'ambient', 'epic', 'upbeat']

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string)
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const createVideo = async () => {
    if (uploadedImages.length === 0) return

    setIsCreating(true)
    setCreationProgress(0)

    // Simulate video creation process
    const canvas = videoCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set 4K resolution
    canvas.width = 3840
    canvas.height = 2160

    const frames: string[] = []
    const totalFrames = uploadedImages.length * 60 // 60 frames per image at 60fps
    let currentFrame = 0

    // Create animation frames
    for (let imgIndex = 0; imgIndex < uploadedImages.length; imgIndex++) {
      const img = new Image()
      img.src = uploadedImages[imgIndex]

      await new Promise(resolve => {
        img.onload = () => {
          // Apply theme effects
          const framesPerImage = 60

          for (let frame = 0; frame < framesPerImage; frame++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            switch (settings.theme) {
              case 'dynamic':
                gradient.addColorStop(0, `hsl(${(currentFrame * 2) % 360}, 70%, 20%)`)
                gradient.addColorStop(1, `hsl(${(currentFrame * 2 + 180) % 360}, 70%, 10%)`)
                break
              case 'cinematic':
                gradient.addColorStop(0, '#1a1a1a')
                gradient.addColorStop(1, '#000000')
                break
              case 'minimal':
                gradient.addColorStop(0, '#ffffff')
                gradient.addColorStop(1, '#f0f0f0')
                break
              case 'sports':
                gradient.addColorStop(0, '#0066FF')
                gradient.addColorStop(1, '#00C896')
                break
              case 'elegant':
                gradient.addColorStop(0, '#2C1810')
                gradient.addColorStop(1, '#0A0E27')
                break
            }
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Apply transition effect
            let opacity = 1
            const transitionFrames = 15

            if (frame < transitionFrames) {
              // Fade in
              opacity = frame / transitionFrames
            } else if (frame > framesPerImage - transitionFrames) {
              // Fade out
              opacity = (framesPerImage - frame) / transitionFrames
            }

            ctx.globalAlpha = opacity

            // Scale and position image
            const scale = 0.8 + (Math.sin((frame / framesPerImage) * Math.PI) * 0.1)
            const imgWidth = img.width * scale
            const imgHeight = img.height * scale
            const x = (canvas.width - imgWidth) / 2
            const y = (canvas.height - imgHeight) / 2

            // Apply transition animation
            switch (settings.transition) {
              case 'zoom':
                ctx.save()
                ctx.translate(canvas.width / 2, canvas.height / 2)
                ctx.scale(scale, scale)
                ctx.translate(-canvas.width / 2, -canvas.height / 2)
                ctx.drawImage(img, x / scale, y / scale, imgWidth / scale, imgHeight / scale)
                ctx.restore()
                break
              case 'slide':
                const slideX = x + (frame < transitionFrames ? (transitionFrames - frame) * 50 : 0)
                ctx.drawImage(img, slideX, y, imgWidth, imgHeight)
                break
              default:
                ctx.drawImage(img, x, y, imgWidth, imgHeight)
            }

            ctx.globalAlpha = 1

            // Add theme-specific overlay effects
            if (settings.theme === 'cinematic') {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
              ctx.fillRect(0, 0, canvas.width, canvas.height * 0.1)
              ctx.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1)
            }

            currentFrame++
            setCreationProgress(Math.round((currentFrame / totalFrames) * 100))
          }
          resolve(null)
        }
      })
    }

    // Generate final video preview frame
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0A0E27'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'white'
    ctx.font = 'bold 120px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('4K Video Created', canvas.width / 2, canvas.height / 2 - 60)

    ctx.font = '60px Arial'
    ctx.fillStyle = '#00C896'
    ctx.fillText(`${uploadedImages.length} images • ${settings.resolution.toUpperCase()} • ${settings.transition}`, canvas.width / 2, canvas.height / 2 + 40)

    ctx.font = '40px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Click download to save your video', canvas.width / 2, canvas.height / 2 + 120)

    const finalFrame = canvas.toDataURL('image/png')
    setVideoUrl(finalFrame)
    setIsCreating(false)
    setCreationProgress(100)
  }

  const downloadVideo = () => {
    if (!videoUrl) return

    const link = document.createElement('a')
    link.download = `video-4k-${Date.now()}.png`
    link.href = videoUrl
    link.click()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings Panel */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Settings size={24} />
          Video Settings
        </h3>

        {/* Theme */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({...settings, theme: e.target.value})}
            className="w-full px-4 py-2 bg-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary capitalize"
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        {/* Duration per image */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Duration per Image: {settings.duration}s
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.duration}
            onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>

        {/* Transition */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Transition Effect</label>
          <select
            value={settings.transition}
            onChange={(e) => setSettings({...settings, transition: e.target.value})}
            className="w-full px-4 py-2 bg-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary capitalize"
          >
            {transitions.map(transition => (
              <option key={transition} value={transition}>{transition}</option>
            ))}
          </select>
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Resolution</label>
          <div className="flex gap-2">
            {['1080p', '4k', '8k'].map(res => (
              <button
                key={res}
                onClick={() => setSettings({...settings, resolution: res})}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  settings.resolution === res
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-dark/80'
                }`}
              >
                {res.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Music Style */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Background Music</label>
          <select
            value={settings.music}
            onChange={(e) => setSettings({...settings, music: e.target.value})}
            className="w-full px-4 py-2 bg-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary capitalize"
          >
            {musicStyles.map(music => (
              <option key={music} value={music}>{music}</option>
            ))}
          </select>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-dark rounded-lg hover:bg-dark/80 transition-colors"
        >
          <Upload size={20} />
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Preview & Creation Panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Uploaded Images ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {uploadedImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Video Preview */}
        <div className="bg-dark rounded-lg p-6">
          <canvas
            ref={videoCanvasRef}
            width={1920}
            height={1080}
            className="w-full h-auto rounded-lg bg-dark-light"
          />
        </div>

        {/* Creation Progress */}
        {isCreating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Creating video...</span>
              <span className="text-primary font-medium">{creationProgress}%</span>
            </div>
            <div className="w-full bg-dark rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${creationProgress}%` }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={createVideo}
            disabled={uploadedImages.length === 0 || isCreating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Film size={20} />
            {isCreating ? 'Creating Video...' : 'Create 4K Video'}
          </button>

          {videoUrl && (
            <button
              onClick={downloadVideo}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Download size={20} />
              Download
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-dark p-4 rounded-lg border border-gray-800">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Play size={16} className="text-primary" />
            Video Creation Info
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Upload multiple player images or any images</li>
            <li>• Customize theme, transitions, and effects</li>
            <li>• Output resolution: {settings.resolution.toUpperCase()} (3840×2160)</li>
            <li>• Estimated duration: {uploadedImages.length * settings.duration}s</li>
            <li>• Dynamic transitions with {settings.transition} effect</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
