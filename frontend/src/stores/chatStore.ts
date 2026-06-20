import { create } from 'zustand'
import { ChatMessage } from '@/types'

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  conversationId: string | null
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  setConversationId: (id: string | null) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      role: 'assistant',
      content: 'Hello! I am UniGuj AI, your educational consultant for Gujarat universities. How can I help you today?',
      timestamp: new Date(),
      suggestions: [
        'Which university is best for MCA in Ahmedabad?',
        'Compare top engineering colleges',
        'Find scholarships for SC students',
        'What are placement stats for IIT Gandhinagar?',
      ],
    },
  ],
  isTyping: false,
  conversationId: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  setConversationId: (id) => set({ conversationId: id }),
  clearChat: () =>
    set({
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I am UniGuj AI, your educational consultant for Gujarat universities. How can I help you today?',
          timestamp: new Date(),
          suggestions: [
            'Which university is best for MCA in Ahmedabad?',
            'Compare top engineering colleges',
            'Find scholarships for SC students',
            'What are placement stats for IIT Gandhinagar?',
          ],
        },
      ],
      conversationId: null,
    }),
}))
