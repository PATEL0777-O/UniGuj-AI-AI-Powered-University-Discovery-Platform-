import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  Award,
  BarChart3,
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper'
import { useQuery } from '@tanstack/react-query'
import { placementApi } from '@/services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#8B5CF6', '#22D3EE', '#10B981', '#FBBF24', '#F43F5E', '#6366F1']

export const Placements = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'branches'>('overview')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['placement-stats'],
    queryFn: async () => {
      const response = await placementApi.getStats()
      return response.data
    },
  })

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['placement-trends'],
    queryFn: async () => {
      const response = await placementApi.getTrends()
      return response.data
    },
  })

  const { data: placements, isLoading: placementsLoading } = useQuery({
    queryKey: ['placements'],
    queryFn: async () => {
      const response = await placementApi.getAll()
      return response.data
    },
  })

  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Placement <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Real-time placement data, company statistics, and salary trends across Gujarat universities.
            </p>
          </FadeIn>

          {/* Stats Cards */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Building2, label: 'Companies', value: stats?.top_companies?.length || 10, color: 'text-primary' },
                { icon: Users, label: 'Students Hired', value: stats?.university_stats?.reduce((sum: number, u: any) => sum + u.total_hired, 0) || 500, color: 'text-accent' },
                { icon: DollarSign, label: 'Avg Package', value: `Rs ${(stats?.university_stats?.reduce((sum: number, u: any) => sum + u.avg_package, 0) / (stats?.university_stats?.length || 1)).toFixed(1)}L`, color: 'text-success' },
                { icon: Award, label: 'Highest Package', value: `Rs ${Math.max(...(stats?.university_stats?.map((u: any) => u.highest_package) || [0]))}L`, color: 'text-warning' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-4 text-center"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['overview', 'companies', 'branches'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">University-wise Average Packages</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.university_stats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="university" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs ${value} LPA`} />
                  <Bar dataKey="avg_package" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Package Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs ${value} LPA`} />
                  <Line type="monotone" dataKey="avg_package" stroke="#22D3EE" strokeWidth={3} dot={{ fill: '#22D3EE' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Top Recruiters</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats?.top_companies || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="company" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total_hired" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Company-wise Average Packages</h3>
              <div className="space-y-3">
                {stats?.top_companies?.map((company: any, index: number) => (
                  <div key={company.company} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {company.company[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-secondary">{company.company}</span>
                        <span className="text-sm text-primary font-semibold">Rs {company.avg_package} LPA</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(company.total_hired / 50) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-2 rounded-full bg-primary"
                        />
                      </div>
                      <span className="text-xs text-gray-500">{company.total_hired} students hired</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Branch-wise Placement Stats</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.branch_stats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs ${value} LPA`} />
                  <Bar dataKey="avg_package" fill="#22D3EE" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">Branch Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.branch_stats || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="total_hired"
                    nameKey="branch"
                  >
                    {(stats?.branch_stats || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {stats?.branch_stats?.map((branch: any, index: number) => (
                  <div key={branch.branch} className="flex items-center gap-1 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-gray-600">{branch.branch}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Recent Placements Table */}
        <Card className="mt-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-secondary mb-4">Recent Placements</h3>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">University</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Branch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Package</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hired</th>
              </tr>
            </thead>
            <tbody>
              {placements?.slice(0, 10).map((placement: any) => (
                <tr key={placement.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-secondary font-medium">{placement.university_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{placement.company_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{placement.role}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="text-xs">{placement.branch}</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-success">Rs {placement.package_lpa} LPA</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{placement.students_hired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  )
}
