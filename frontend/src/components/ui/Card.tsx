import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
}: CardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6 
        ${glow ? 'card-glow' : 'shadow-lg shadow-gray-200/50'}
        ${hover ? 'cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
