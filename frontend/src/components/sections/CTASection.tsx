import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/animations/MotionWrapper'

export const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-20" />
      <motion.div
        className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Find Your
            <br />
            <span className="text-gradient">Dream University?</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join 10,000+ students who have already found their perfect educational path with UniGuj AI.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/chat')}
              icon={<Sparkles className="w-5 h-5" />}
            >
              Start with AI Assistant
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/universities')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Browse Universities
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
