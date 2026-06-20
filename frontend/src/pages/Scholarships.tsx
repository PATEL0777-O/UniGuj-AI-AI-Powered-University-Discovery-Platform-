import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  Search,
  Filter,
  Clock,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'
import { useQuery } from '@tanstack/react-query'
import { scholarshipApi } from '@/services/api'

const categories = ['All', 'General', 'OBC', 'SC', 'ST', 'Minority']
const courseLevels = ['All', 'Undergraduate', 'Postgraduate', 'Any']

export const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [showEligibilityCheck, setShowEligibilityCheck] = useState(false)
  const [eligibilityForm, setEligibilityForm] = useState({
    marks: '',
    category: 'General',
    income: '',
    courseLevel: 'Undergraduate',
  })

  const { data: scholarships, isLoading } = useQuery({
    queryKey: ['scholarships', selectedCategory, selectedLevel],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (selectedCategory !== 'All') params.category = selectedCategory
      if (selectedLevel !== 'All') params.course_level = selectedLevel
      const response = await scholarshipApi.getAll(params)
      return response.data
    },
  })

  const { data: eligibilityResults, refetch: checkEligibility } = useQuery({
    queryKey: ['eligibility', eligibilityForm],
    queryFn: async () => {
      const response = await scholarshipApi.checkEligibility({
        marks: Number(eligibilityForm.marks),
        category: eligibilityForm.category,
        income: Number(eligibilityForm.income),
        course_level: eligibilityForm.courseLevel,
      })
      return response.data
    },
    enabled: false,
  })

  const filteredScholarships = scholarships?.filter((s: any) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q)
  })

  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Scholarship <span className="text-gradient">Finder</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Discover scholarships you are eligible for. Filter by category, course level, and check your eligibility.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scholarships..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <Button
                variant="primary"
                onClick={() => setShowEligibilityCheck(!showEligibilityCheck)}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Check Eligibility
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Eligibility Checker */}
        {showEligibilityCheck && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20"
          >
            <h3 className="text-lg font-semibold text-secondary mb-4">Check Your Eligibility</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                type="number"
                placeholder="Your Marks (%)"
                value={eligibilityForm.marks}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, marks: e.target.value })}
              />
              <select
                value={eligibilityForm.category}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, category: e.target.value })}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Annual Income (Rs)"
                value={eligibilityForm.income}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, income: e.target.value })}
              />
              <Button
                variant="primary"
                onClick={() => checkEligibility()}
              >
                Check Now
              </Button>
            </div>

            {eligibilityResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-success/10 border border-success/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-success">
                    You are eligible for {eligibilityResults.total} scholarships!
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Scholarship Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships?.map((scholarship: any) => (
              <StaggerItem key={scholarship.id}>
                <ScholarshipCard scholarship={scholarship} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </Layout>
  )
}

function ScholarshipCard({ scholarship }: { scholarship: any }) {
  const daysLeft = scholarship.days_left || Math.max(0, Math.ceil((new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <Card hover glow className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <Badge variant={daysLeft < 30 ? 'error' : daysLeft < 60 ? 'warning' : 'success'}>
          {daysLeft} days left
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-secondary mb-1">{scholarship.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{scholarship.provider}</p>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scholarship.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Amount:</span>
          <span className="font-semibold text-primary">{scholarship.amount.type}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Min Marks:</span>
          <span className="font-semibold text-secondary">{scholarship.eligibility.min_marks}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Income Limit:</span>
          <span className="font-semibold text-secondary">Rs {scholarship.eligibility.income_limit.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {scholarship.eligibility.category.map((cat: string) => (
          <span key={cat} className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600">
            {cat}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <FileText className="w-3 h-3" />
          <span>{scholarship.documents_required.length} documents required</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => window.open(scholarship.apply_link, '_blank')}
          icon={<ExternalLink className="w-4 h-4" />}
        >
          Apply Now
        </Button>
      </div>
    </Card>
  )
}
