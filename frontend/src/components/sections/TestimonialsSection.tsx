import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'

const testimonials = [
  {
    name: 'Priya Patel',
    role: 'MCA Student, Gujarat University',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    content: 'UniGuj AI helped me find the perfect MCA program. The AI chatbot answered all my questions about fees, placements, and campus life. I got placed at TCS with a 4.5 LPA package!',
    rating: 5,
  },
  {
    name: 'Rahul Sharma',
    role: 'B.Tech CSE, Nirma University',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    content: 'The comparison feature is amazing! I compared 4 universities and chose Nirma based on placement stats. The scholarship finder also helped me get the MYSY scholarship.',
    rating: 5,
  },
  {
    name: 'Ananya Desai',
    role: 'MBA, M.S. University',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    content: 'I was confused between multiple MBA programs. The career recommendation engine suggested the perfect path for me. Now I am working at HDFC Bank as a Management Trainee.',
    rating: 5,
  },
]

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
            Student <span className="text-gradient">Success Stories</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from students who found their dream universities with UniGuj AI.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-secondary">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
