import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Mic,
  MicOff,
  RotateCcw,
  Lightbulb,
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { useChatStore } from '@/stores/chatStore'
import { TypingIndicator } from '@/components/animations/MotionWrapper'
import { chatApi } from '@/services/api'
import toast from 'react-hot-toast'

export const Chat = () => {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isTyping, addMessage, setTyping, clearChat } = useChatStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Web Speech API for voice input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice input not supported in your browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      handleSend(transcript)
    }
    recognition.onerror = () => {
      setIsListening(false)
      toast.error('Voice recognition failed')
    }

    recognition.start()
  }

  const handleSend = async (queryText?: string) => {
    const query = queryText || input
    if (!query.trim()) return

    const userMessage = {
      role: 'user' as const,
      content: query,
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
    setTyping(true)

    try {
      // Use non-streaming for simplicity in demo
      const response = await chatApi.sendMessage({ query })

      addMessage({
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        suggestions: response.data.suggestions,
      })
    } catch (error) {
      // Fallback response for demo
      const fallbackResponses: Record<string, string> = {
        'mca': 'Gujarat University and M.S. University of Baroda are top choices for MCA in Gujarat. Gujarat University offers MCA at Rs 85,000/year with 85% placement rate and average package of 4.5 LPA. M.S. University offers it at Rs 80,000/year with 86% placement rate.',
        'engineering': 'For B.Tech in Gujarat, IIT Gandhinagar is the top choice with 18.5 LPA average package. Nirma University (8.5 LPA avg) and PDPU (9.8 LPA avg) are excellent private options. Charusat and Ganpat University offer great value at lower fees.',
        'scholarship': 'The MYSY Scholarship offers full tuition support for students with 80%+ marks. Digital Gujarat Scholarship provides maintenance allowance for SC/ST/OBC students. Nirma University and IIT Gandhinagar also offer merit-based scholarships.',
        'placement': 'IIT Gandhinagar leads with 18.5 LPA average package. Nirma University averages 8.5 LPA. Gujarat University and M.S. University offer 4.5-6.5 LPA. Top recruiters include TCS, Infosys, Google, Microsoft, and Amazon.',
        'compare': 'I can help you compare universities! Try visiting the Compare page or tell me which universities you want to compare.',
        'best': 'The best university depends on your goals! For engineering: IIT Gandhinagar. For architecture: CEPT University. For MBA: Nirma University or M.S. University. For affordable options: Gujarat University or Sardar Patel University.',
      }

      let responseText = 'I am here to help you with Gujarat universities! You can ask me about specific courses, fees, placements, scholarships, or compare universities. What would you like to know?'

      const lowerQuery = query.toLowerCase()
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (lowerQuery.includes(key)) {
          responseText = value
          break
        }
      }

      addMessage({
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        suggestions: [
          'Compare top 3 engineering colleges',
          'Show scholarships for general category',
          'What is the admission process?',
        ],
      })
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex flex-col bg-secondary">
        {/* Chat Header */}
        <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">UniGuj AI Assistant</h2>
              <p className="text-xs text-gray-400">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(suggestion)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                        >
                          <Lightbulb className="w-3 h-3 text-accent" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 rounded-2xl">
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button
              onClick={startListening}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-error/20 text-error animate-pulse'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about universities, courses, fees, placements..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              variant="primary"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="rounded-xl px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-2">
            AI responses are based on real university data. Always verify with official sources.
          </p>
        </div>
      </div>
    </Layout>
  )
}
