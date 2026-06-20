import { motion } from 'framer-motion'
import { Search, Brain, BarChart3, CheckCircle } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Search University',
    description: 'Search by city, course, or university name. Our AI understands natural language queries.',
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI Analyzes Data',
    description: 'Our Gemini-powered AI processes real university data to provide accurate, grounded answers.',
  },
  {
    icon: BarChart3,
    number: '03',
    title: 'Compare & Analyze',
    description: 'Side-by-side comparison with visual charts for fees, placements, rankings, and facilities.',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Make Your Decision',
    description: 'Get personalized recommendations and confidently choose your dream university.',
  },
]

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Four simple steps to find your perfect university in Gujarat.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={step.number}>
              <div className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-24 h-24 mx-auto rounded-2xl bg-hero-gradient flex items-center justify-center mb-6 relative z-10"
                >
                  <step.icon className="w-10 h-10 text-white" />
                </motion.div>

                <div className="text-5xl font-bold text-white/10 mb-2">{step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
