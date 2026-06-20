import { motion } from 'framer-motion'
import {
  Bot,
  GitCompare,
  Compass,
  Wallet,
  BarChart3,
  Building2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'

const features = [
  {
    icon: Bot,
    title: 'AI University Assistant',
    description: 'Ask anything about Gujarat universities in natural language. Get instant, accurate answers powered by Gemini AI.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: GitCompare,
    title: 'Smart Comparison',
    description: 'Compare up to 4 universities side-by-side with visual charts for fees, placements, rankings, and facilities.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Compass,
    title: 'Career Recommendations',
    description: 'Get personalized course and university recommendations based on your profile, interests, and budget.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Wallet,
    title: 'Scholarship Finder',
    description: 'Discover scholarships you are eligible for with smart filtering by marks, category, and income.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: BarChart3,
    title: 'Placement Insights',
    description: 'Real-time placement data with company-wise statistics, salary trends, and branch-wise analysis.',
    color: 'bg-error/10 text-error',
  },
  {
    icon: Building2,
    title: 'University Directory',
    description: 'Browse 50+ Gujarat universities with complete profiles, virtual tours, and admission calendars.',
    color: 'bg-primary/10 text-primary',
  },
]

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
            Everything You Need to
            <span className="text-gradient"> Decide</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Powerful tools and AI-driven insights to help you make the best educational choice.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card hover glow className="h-full">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
