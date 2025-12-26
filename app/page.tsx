'use client'

import { useState } from 'react'
import ForexNewsPanel from '@/components/ForexNewsPanel'
import PlayerGenerator from '@/components/PlayerGenerator'
import VideoCreator from '@/components/VideoCreator'
import { TrendingUp, Users, Video } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'news' | 'players' | 'video'>('news')

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Forex AI Studio
          </h1>
          <p className="text-gray-400">
            AI-powered forex news monitoring, player generation & 4K video creation
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'news'
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'bg-dark-light text-gray-400 hover:bg-dark-light/80'
            }`}
          >
            <TrendingUp size={20} />
            Forex News Alerts
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'players'
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'bg-dark-light text-gray-400 hover:bg-dark-light/80'
            }`}
          >
            <Users size={20} />
            AI Player Generator
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'video'
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'bg-dark-light text-gray-400 hover:bg-dark-light/80'
            }`}
          >
            <Video size={20} />
            4K Video Creator
          </button>
        </nav>

        {/* Content Panels */}
        <div className="bg-dark-light rounded-xl shadow-2xl p-6">
          {activeTab === 'news' && <ForexNewsPanel />}
          {activeTab === 'players' && <PlayerGenerator />}
          {activeTab === 'video' && <VideoCreator />}
        </div>
      </div>
    </main>
  )
}
