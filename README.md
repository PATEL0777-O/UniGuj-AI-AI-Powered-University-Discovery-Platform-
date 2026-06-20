# 🎓 UniGuj AI - Complete Full-Stack Application

**"Stop Searching. Start Deciding."**

An AI-powered EdTech platform that helps students find, compare, and choose the best universities in Gujarat.

---

## 📁 Project Structure

```
uniguj-ai/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── core/           # Config, Security, Dependencies
│   │   ├── api/v1/         # API Endpoints
│   │   ├── models/         # MongoDB Models
│   │   ├── schemas/        # Pydantic Schemas
│   │   ├── services/       # Business Logic (Gemini, Recommendations)
│   │   └── utils/          # Data Seeder
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
│
└── frontend/               # React + TypeScript Frontend
    ├── src/
    │   ├── components/     # UI, Layout, Sections, Animations
    │   ├── pages/          # Route Pages
    │   ├── hooks/          # Custom Hooks
    │   ├── stores/         # Zustand Stores
    │   ├── services/       # API Client
    │   └── types/          # TypeScript Types
    ├── Dockerfile
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and navigate
cd uniguj-ai/backend

# Start all services
docker-compose up -d

# The app will be available at:
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Frontend: http://localhost:80
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API Key

# Start MongoDB locally or use MongoDB Atlas
# Then run:
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install

# Set up environment variables
cp .env.example .env

npm run dev
# Open http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/unigujai
DATABASE_NAME=unigujai
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-super-secret-key
REDIS_URL=redis://localhost:6379/0
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## ✨ Features Implemented

### 1. AI University Assistant (Gemini-Powered)
- Natural language chat interface
- Streaming responses with typing effect
- Voice input support (Web Speech API)
- Smart follow-up suggestions
- Context-aware responses based on real university data

### 2. Dynamic University Comparison
- Side-by-side comparison (up to 4 universities)
- Bar charts and radar charts for visual analysis
- Compare: Fees, Placements, Rankings, Facilities
- Detailed comparison table

### 3. AI Career Recommendation Engine
- Profile-based matching algorithm
- Career path visualization
- Course and university recommendations
- Confidence scoring

### 4. Smart Scholarship Finder
- Dynamic filtering by category, marks, income
- Eligibility checker with form validation
- Application deadline tracking
- Government + Private scholarships database

### 5. Placement Insights Dashboard
- Real-time placement statistics
- Top recruiters with company logos
- Year-over-year trends with line charts
- Branch-wise placement analysis
- Interactive charts (Bar, Line, Pie, Radar)

### 6. University Directory
- 50+ Gujarat universities with real data
- Advanced search and filtering
- Bookmark & shortlist functionality
- Rating and accreditation display

---

## 🎨 Design System

- **Primary:** #8B5CF6 (Purple)
- **Secondary:** #020617 (Dark)
- **Accent:** #22D3EE (Cyan)
- **Success:** #10B981
- **Warning:** #FBBF24
- **Error:** #F43F5E

### Animations (Framer Motion)
- Page transitions with fade + slide
- Scroll-triggered reveals
- Stagger effects for cards
- Hover micro-interactions
- Loading skeletons
- Number counters
- Typing indicators
- Progress bars

---

## 📊 Database Schema

### Universities Collection
- Name, location, type, established year
- Accreditation, courses, fees, seats
- Placement statistics, rankings, facilities
- Contact info, images, virtual tours

### Scholarships Collection
- Name, provider, eligibility criteria
- Amount, deadline, application link
- Required documents, description

### Placements Collection
- University, company, role, package
- Students hired, branch, year

### Users Collection
- Profile, bookmarks, chat history
- Education, interests, skills, budget

---

## 🔒 Security Features

- JWT Authentication (Access + Refresh tokens)
- Password hashing with bcrypt
- Rate limiting with Redis
- CORS configuration
- Input validation with Pydantic
- No sensitive data in localStorage

---

## 📱 Responsive Design

- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (full layout)

---

## 🧪 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/me` | GET | Get current user |
| `/api/v1/universities/` | GET | List all universities |
| `/api/v1/universities/search` | GET | Search universities |
| `/api/v1/compare/` | POST | Compare universities |
| `/api/v1/scholarships/` | GET | List scholarships |
| `/api/v1/scholarships/eligible` | GET | Check eligibility |
| `/api/v1/placements/` | GET | List placements |
| `/api/v1/placements/stats` | GET | Placement statistics |
| `/api/v1/ai/chat` | POST | AI chat (SSE stream) |
| `/api/v1/ai/chat/json` | POST | AI chat (JSON) |
| `/api/v1/recommendations/` | POST | Get recommendations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Backend | FastAPI, Python 3.11 |
| Database | MongoDB Atlas |
| AI | Gemini API |
| Cache | Redis |
| Auth | JWT + bcrypt |
| Deployment | Docker + Docker Compose |

---

## 📝 License

MIT License - Built with passion for Gujarat students.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Made with ❤️ for Gujarat Students**
