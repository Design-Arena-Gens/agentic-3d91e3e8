'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Filter, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NewsItem {
  id: string
  title: string
  summary: string
  impact: 'high' | 'medium' | 'low'
  currency: string
  timestamp: Date
  sentiment: 'bullish' | 'bearish' | 'neutral'
  source: string
}

export default function ForexNewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(['All'])
  const [impactFilter, setImpactFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currencies = ['All', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF']

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterNews()
  }, [news, selectedCurrencies, impactFilter, searchQuery])

  const fetchNews = async () => {
    setIsLoading(true)
    // Simulate API call with mock data
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Fed Signals Interest Rate Hold',
          summary: 'Federal Reserve indicates rates will remain unchanged through Q4, affecting USD strength across major pairs.',
          impact: 'high',
          currency: 'EUR/USD',
          timestamp: new Date(),
          sentiment: 'bearish',
          source: 'Reuters'
        },
        {
          id: '2',
          title: 'ECB Minutes Show Dovish Tone',
          summary: 'European Central Bank meeting minutes reveal cautious approach to monetary policy, impacting EUR pairs.',
          impact: 'high',
          currency: 'EUR/USD',
          timestamp: new Date(Date.now() - 1800000),
          sentiment: 'bullish',
          source: 'Bloomberg'
        },
        {
          id: '3',
          title: 'UK GDP Growth Exceeds Expectations',
          summary: 'British GDP data shows 0.6% growth, stronger than forecasted 0.4%, boosting GBP sentiment.',
          impact: 'medium',
          currency: 'GBP/USD',
          timestamp: new Date(Date.now() - 3600000),
          sentiment: 'bullish',
          source: 'Financial Times'
        },
        {
          id: '4',
          title: 'Bank of Japan Maintains Ultra-Loose Policy',
          summary: 'BoJ keeps interest rates at -0.1%, continuing yield curve control amid inflation concerns.',
          impact: 'medium',
          currency: 'USD/JPY',
          timestamp: new Date(Date.now() - 5400000),
          sentiment: 'neutral',
          source: 'Nikkei'
        },
        {
          id: '5',
          title: 'Australian Employment Data Surprises',
          summary: 'Australia adds 64K jobs vs 25K expected, unemployment rate drops to 3.5%, strengthening AUD.',
          impact: 'high',
          currency: 'AUD/USD',
          timestamp: new Date(Date.now() - 7200000),
          sentiment: 'bullish',
          source: 'ABC Finance'
        },
        {
          id: '6',
          title: 'Oil Prices Impact Canadian Dollar',
          summary: 'Crude oil prices surge 3.5% on supply concerns, providing support for CAD across the board.',
          impact: 'low',
          currency: 'USD/CAD',
          timestamp: new Date(Date.now() - 9000000),
          sentiment: 'bearish',
          source: 'MarketWatch'
        }
      ]
      setNews(mockNews)
      setIsLoading(false)
    }, 800)
  }

  const filterNews = () => {
    let filtered = news

    if (!selectedCurrencies.includes('All')) {
      filtered = filtered.filter(item => selectedCurrencies.includes(item.currency))
    }

    if (impactFilter !== 'all') {
      filtered = filtered.filter(item => item.impact === impactFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNews(filtered)
  }

  const toggleCurrency = (currency: string) => {
    if (currency === 'All') {
      setSelectedCurrencies(['All'])
    } else {
      const newSelection = selectedCurrencies.includes(currency)
        ? selectedCurrencies.filter(c => c !== currency)
        : [...selectedCurrencies.filter(c => c !== 'All'), currency]
      setSelectedCurrencies(newSelection.length === 0 ? ['All'] : newSelection)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="text-green-400" size={16} />
      case 'bearish': return <TrendingDown className="text-red-400" size={16} />
      default: return <div className="w-4 h-0.5 bg-gray-400"></div>
    }
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Refresh */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={fetchNews}
            disabled={isLoading}
            className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Currency Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Currency Pairs:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currencies.map(currency => (
              <button
                key={currency}
                onClick={() => toggleCurrency(currency)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCurrencies.includes(currency)
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-dark/80'
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Impact Level:</span>
          </div>
          <div className="flex gap-2">
            {['all', 'high', 'medium', 'low'].map(impact => (
              <button
                key={impact}
                onClick={() => setImpactFilter(impact)}
                className={`px-4 py-1 rounded-full text-sm capitalize transition-colors ${
                  impactFilter === impact
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-dark/80'
                }`}
              >
                {impact}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
        <AnimatePresence>
          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark p-4 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(item.impact)}`}>
                    {item.impact.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{item.source}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{item.summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(item.sentiment)}
                  <span className="text-xs text-gray-500 capitalize">{item.sentiment}</span>
                </div>
                <span className="text-sm font-medium text-primary">{item.currency}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNews.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            No news items match your filters
          </div>
        )}
      </div>
    </div>
  )
}
