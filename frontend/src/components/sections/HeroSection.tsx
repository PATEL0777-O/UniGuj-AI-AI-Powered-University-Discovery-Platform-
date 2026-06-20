import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Sparkles,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Wallet,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/animations/MotionWrapper'

const stats = [
  { icon: GraduationCap, value: '50+', label: 'Universities' },
  { icon: TrendingUp, value: '500+', label: 'Courses' },
  { icon: Wallet, value: 'Rs 50Cr+', label: 'Scholarships' },
  { icon: Users, value: '10,000+', label: 'Students Helped' },
]

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/universities?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920')] bg-cover bg-center opacity-10" />
        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-gray-300">AI-Powered Education Platform</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Stop Searching.
              <br />
              <span className="text-gradient">Start Deciding.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find, compare, and choose the best universities in Gujarat with AI-powered guidance.
              Get personalized recommendations, scholarship alerts, and placement insights.
            </p>
          </FadeIn>

          {/* Search Bar */}
          <FadeIn delay={0.3}>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search universities, courses, or cities..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="absolute right-2 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </form>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/chat')}
                icon={<Sparkles className="w-5 h-5" />}
              >
                Ask AI Assistant
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/universities')}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Universities
              </Button>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.5}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="glass rounded-2xl p-4"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
