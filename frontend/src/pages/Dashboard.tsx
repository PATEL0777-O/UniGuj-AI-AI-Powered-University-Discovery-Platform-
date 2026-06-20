import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  TrendingUp,
  MessageSquare,
  Bookmark,
  Sparkles,
  ArrowRight,
  Bell,
  Clock,
  Star,
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useCompareStore } from '@/stores/compareStore'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'

const quickActions = [
  { icon: MessageSquare, label: 'Ask AI', description: 'Get instant answers', path: '/chat', color: 'bg-primary/10 text-primary' },
  { icon: GraduationCap, label: 'Find Universities', description: 'Browse all colleges', path: '/universities', color: 'bg-accent/10 text-accent' },
  { icon: Wallet, label: 'Scholarships', description: 'Find funding options', path: '/scholarships', color: 'bg-success/10 text-success' },
  { icon: TrendingUp, label: 'Placements', description: 'View salary data', path: '/placements', color: 'bg-warning/10 text-warning' },
]

const recentActivity = [
  { type: 'view', text: 'Viewed IIT Gandhinagar profile', time: '2 hours ago' },
  { type: 'compare', text: 'Compared 3 universities', time: '5 hours ago' },
  { type: 'bookmark', text: 'Bookmarked Nirma University', time: '1 day ago' },
  { type: 'chat', text: 'Asked about MCA programs', time: '2 days ago' },
]

const upcomingDeadlines = [
  { name: 'MYSY Scholarship', deadline: '2025-07-15', daysLeft: 35 },
  { name: 'Nirma University Admission', deadline: '2025-06-30', daysLeft: 20 },
  { name: 'GUJCET Registration', deadline: '2025-06-20', daysLeft: 10 },
]

export const Dashboard = () => {
  const { user } = useAuth()
  const { compareList } = useCompareStore()
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                Welcome back, <span className="text-gradient">{user?.name || 'Student'}</span>
              </h1>
              <p className="text-gray-500 mt-1">Here is what is happening with your university search</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: GraduationCap, label: 'Universities', value: '50+', color: 'bg-primary/10 text-primary' },
              { icon: Wallet, label: 'Scholarships', value: '25+', color: 'bg-success/10 text-success' },
              { icon: Bookmark, label: 'Bookmarked', value: compareList.length.toString(), color: 'bg-accent/10 text-accent' },
              { icon: TrendingUp, label: 'Placements', value: '500+', color: 'bg-warning/10 text-warning' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.2}>
              <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <StaggerItem key={action.label}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(action.path)}
                      className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-semibold text-secondary mb-1">{action.label}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>

            {/* AI Recommendation */}
            <FadeIn delay={0.3}>
              <div className="mt-6 bg-hero-gradient rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">AI Recommendation</span>
                  </div>
                  <p className="text-white/80 mb-4 text-sm">
                    Based on your profile, we recommend exploring B.Tech CSE programs at IIT Gandhinagar, Nirma University, or PDPU.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => navigate('/chat')}
                  >
                    Get Personalized Advice
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <FadeIn delay={0.3}>
              <Card>
                <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-secondary">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.deadline}</p>
                      </div>
                      <Badge variant={item.daysLeft < 15 ? 'error' : 'warning'} className="text-xs">
                        {item.daysLeft} days
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>

            {/* Recent Activity */}
            <FadeIn delay={0.4}>
              <Card>
                <h3 className="font-semibold text-secondary mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {activity.type === 'view' && <GraduationCap className="w-4 h-4 text-primary" />}
                        {activity.type === 'compare' && <TrendingUp className="w-4 h-4 text-primary" />}
                        {activity.type === 'bookmark' && <Bookmark className="w-4 h-4 text-primary" />}
                        {activity.type === 'chat' && <MessageSquare className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm text-secondary">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>

            {/* Compare List */}
            {compareList.length > 0 && (
              <FadeIn delay={0.5}>
                <Card>
                  <h3 className="font-semibold text-secondary mb-4">Compare List</h3>
                  <div className="space-y-2">
                    {compareList.map((uni) => (
                      <div key={uni.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm text-secondary flex-1">{uni.name}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => navigate('/compare')}
                  >
                    Compare Now
                  </Button>
                </Card>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
