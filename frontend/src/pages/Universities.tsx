import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  MapPin,
  Star,
  GraduationCap,
  ChevronDown,
  X,
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useUniversities } from '@/hooks/useUniversities'
import { useCompareStore } from '@/stores/compareStore'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'
import { University } from '@/types'

const cities = ['All', 'Ahmedabad', 'Gandhinagar', 'Vadodara', 'Rajkot', 'Mehsana', 'Anand', 'Vallabh Vidyanagar']
const types = ['All', 'Government', 'Private', 'Deemed']

export const Universities = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCity, setSelectedCity] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const { data: universities, isLoading } = useUniversities({
    city: selectedCity !== 'All' ? selectedCity : undefined,
    type_filter: selectedType !== 'All' ? selectedType : undefined,
  })

  const { compareList, addToCompare, removeFromCompare, isInCompare } = useCompareStore()

  const filteredUniversities = universities?.filter((uni: University) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      uni.name.toLowerCase().includes(q) ||
      uni.location.city.toLowerCase().includes(q) ||
      uni.courses.some((c) => c.name.toLowerCase().includes(q))
    )
  })

  return (
    <Layout>
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore <span className="text-gradient">Universities</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Discover 50+ universities across Gujarat with detailed profiles, courses, and placement data.
            </p>
          </FadeIn>

          {/* Search & Filters */}
          <FadeIn delay={0.1}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, city, or course..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </FadeIn>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">City</label>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedCity === city
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedType === type
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* University Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compare Bar */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {compareList.length} university{compareList.length > 1 ? 'ies' : 'y'} selected
              </span>
              <div className="flex gap-1">
                {compareList.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => removeFromCompare(u.id)}
                    className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs flex items-center gap-1"
                  >
                    {u.name.split(' ')[0]}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = '/compare'}
            >
              Compare Now
            </Button>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities?.map((university: University) => (
              <StaggerItem key={university.id}>
                <UniversityCard
                  university={university}
                  isInCompare={isInCompare(university.id)}
                  onToggleCompare={() =>
                    isInCompare(university.id)
                      ? removeFromCompare(university.id)
                      : addToCompare(university)
                  }
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!isLoading && filteredUniversities?.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No universities found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

function UniversityCard({
  university,
  isInCompare,
  onToggleCompare,
}: {
  university: University
  isInCompare: boolean
  onToggleCompare: () => void
}) {
  const avgFees = Math.round(
    university.courses.reduce((sum, c) => sum + c.fees, 0) / university.courses.length
  )
  const avgPackage = (
    university.courses.reduce((sum, c) => sum + (c.placement_stats?.avg_package || 0), 0) /
    university.courses.length
  ).toFixed(1)

  return (
    <Card hover glow className="overflow-hidden">
      <div className="relative h-48 -mx-6 -mt-6 mb-4">
        <img
          src={university.images[0] || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
          alt={university.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <Badge variant={university.type === 'Government' ? 'success' : university.type === 'Private' ? 'primary' : 'warning'}>
              {university.type}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-white">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{university.rating}</span>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-secondary mb-1">{university.name}</h3>
      <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
        <MapPin className="w-4 h-4" />
        {university.location.city}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-sm font-semibold text-secondary">Rs {avgFees.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Avg. Fees</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-sm font-semibold text-secondary">{avgPackage} LPA</div>
          <div className="text-xs text-gray-500">Avg. Package</div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {university.courses.slice(0, 3).map((course) => (
          <span key={course.name} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
            {course.name}
          </span>
        ))}
        {university.courses.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-500">
            +{university.courses.length - 3}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => window.location.href = `/universities/${university.id}`}
        >
          View Details
        </Button>
        <Button
          variant={isInCompare ? 'primary' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onToggleCompare()
          }}
        >
          {isInCompare ? 'Added' : 'Compare'}
        </Button>
      </div>
    </Card>
  )
}
