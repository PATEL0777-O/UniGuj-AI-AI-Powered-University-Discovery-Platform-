import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GitCompare,
  MapPin,
  Star,
  GraduationCap,
  Calendar,
  Award,
  Wifi,
  BookOpen,
  Hotel,
  Dumbbell,
  Coffee,
  FlaskConical,
  Mic,
  X,
  ArrowRight,
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCompareStore } from '@/stores/compareStore'
import { FadeIn } from '@/components/animations/MotionWrapper'
import { University } from '@/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts'

const facilityIcons: Record<string, React.ReactNode> = {
  'Library': <BookOpen className="w-4 h-4" />,
  'Hostel': <Hotel className="w-4 h-4" />,
  'Sports Complex': <Dumbbell className="w-4 h-4" />,
  'WiFi': <Wifi className="w-4 h-4" />,
  'Cafeteria': <Coffee className="w-4 h-4" />,
  'Research Labs': <FlaskConical className="w-4 h-4" />,
  'Auditorium': <Mic className="w-4 h-4" />,
}

export const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore()
  const navigate = useNavigate()
  const [comparisonData, setComparisonData] = useState<any>(null)

  useEffect(() => {
    if (compareList.length < 2) return

    // Prepare chart data
    const feesData = compareList.map((u) => ({
      name: u.name.split(' ')[0],
      fees: Math.round(u.courses.reduce((sum, c) => sum + c.fees, 0) / u.courses.length),
    }))

    const placementData = compareList.map((u) => ({
      name: u.name.split(' ')[0],
      package: Number((u.courses.reduce((sum, c) => sum + (c.placement_stats?.avg_package || 0), 0) / u.courses.length).toFixed(1)),
    }))

    const radarData = [
      { metric: 'Fees', ...compareList.reduce((acc, u, i) => ({ ...acc, [u.name.split(' ')[0]]: Math.round((100 - (u.courses.reduce((sum, c) => sum + c.fees, 0) / u.courses.length) / 3000)) }), {}) },
      { metric: 'Placement', ...compareList.reduce((acc, u, i) => ({ ...acc, [u.name.split(' ')[0]]: Math.round((u.courses.reduce((sum, c) => sum + (c.placement_stats?.avg_package || 0), 0) / u.courses.length) * 4) }), {}) },
      { metric: 'Ranking', ...compareList.reduce((acc, u, i) => ({ ...acc, [u.name.split(' ')[0]]: Math.max(0, 100 - (u.rankings?.nirf || 100)) }), {}) },
      { metric: 'Facilities', ...compareList.reduce((acc, u, i) => ({ ...acc, [u.name.split(' ')[0]]: u.facilities.length * 12 }), {}) },
      { metric: 'Rating', ...compareList.reduce((acc, u, i) => ({ ...acc, [u.name.split(' ')[0]]: Math.round(u.rating * 20) }), {}) },
    ]

    setComparisonData({ feesData, placementData, radarData })
  }, [compareList])

  if (compareList.length < 2) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">Add Universities to Compare</h2>
            <p className="text-gray-500 mb-6">Select at least 2 universities to start comparing</p>
            <Button variant="primary" onClick={() => navigate('/universities')}>
              Browse Universities
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  const colors = ['#8B5CF6', '#22D3EE', '#10B981', '#FBBF24']

  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Compare <span className="text-gradient">Universities</span>
                </h1>
                <p className="text-gray-400">Side-by-side comparison of selected universities</p>
              </div>
              <Button variant="outline" onClick={clearCompare} className="text-gray-300 border-gray-600">
                Clear All
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {compareList.map((uni, index) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative">
                <button
                  onClick={() => removeFromCompare(uni.id)}
                  className="absolute top-2 right-2 p-1 rounded-lg hover:bg-error/10 text-gray-400 hover:text-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={uni.images[0]}
                  alt={uni.name}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-secondary text-sm mb-1">{uni.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                  <MapPin className="w-3 h-3" />
                  {uni.location.city}
                </div>
                <Badge variant={uni.type === 'Government' ? 'success' : uni.type === 'Private' ? 'primary' : 'warning'} className="text-xs">
                  {uni.type}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        {comparisonData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Average Fees Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData.feesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs ${value.toLocaleString()}`} />
                  <Bar dataKey="fees" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Average Package Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData.placementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs ${value} LPA`} />
                  <Bar dataKey="package" fill="#22D3EE" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-secondary mb-4">Overall Comparison Radar</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={comparisonData.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis />
                  {compareList.map((uni, i) => (
                    <Radar
                      key={uni.id}
                      name={uni.name.split(' ')[0]}
                      dataKey={uni.name.split(' ')[0]}
                      stroke={colors[i]}
                      fill={colors[i]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Detailed Comparison Table */}
        <Card className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-secondary mb-4">Detailed Comparison</h3>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Feature</th>
                {compareList.map((uni) => (
                  <th key={uni.id} className="text-left py-3 px-4 text-sm font-medium text-secondary">
                    {uni.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">Established</td>
                {compareList.map((uni) => (
                  <td key={uni.id} className="py-3 px-4 text-sm text-secondary">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      {uni.established}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">NIRF Rank</td>
                {compareList.map((uni) => (
                  <td key={uni.id} className="py-3 px-4 text-sm text-secondary">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-warning" />
                      #{uni.rankings?.nirf || 'N/A'}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">Rating</td>
                {compareList.map((uni) => (
                  <td key={uni.id} className="py-3 px-4 text-sm text-secondary">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      {uni.rating}/5
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">Total Courses</td>
                {compareList.map((uni) => (
                  <td key={uni.id} className="py-3 px-4 text-sm text-secondary">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      {uni.courses.length}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">Facilities</td>
                {compareList.map((uni) => (
                  <td key={uni.id} className="py-3 px-4 text-sm text-secondary">
                    <div className="flex flex-wrap gap-1">
                      {uni.facilities.slice(0, 4).map((f) => (
                        <span key={f} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 flex items-center gap-1">
                          {facilityIcons[f] || null}
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600">Top Courses</td>
                {compareList.map((uni) => (
                  <td key={uni.id} className="py-3 px-4 text-sm text-secondary">
                    <div className="space-y-1">
                      {uni.courses.slice(0, 3).map((c) => (
                        <div key={c.name} className="text-xs">
                          {c.name} - Rs {c.fees.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  )
}
