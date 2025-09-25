'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Users,
  Clock,
  Download
} from 'lucide-react'

interface ReportData {
  bookingStats: {
    total: number
    approved: number
    cancelled: number
    upcoming: number
  }
  dailyBookings: Array<{
    date: string
    count: number
  }>
  courtStats: Array<{
    courtName: string
    bookings: number
  }>
  userStats: {
    totalUsers: number
    newUsersThisMonth: number
    activeUsers: number
  }
}

export default function AdminReports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`/api/admin/reports?days=${dateRange}`)
        if (response.ok) {
          const data = await response.json()
          setReportData(data)
        }
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated' && session?.user?.isAdmin) {
      fetchReportData()
    }
  }, [session, status, dateRange])

  const handleExport = () => {
    if (!reportData) return
    
    const csvData = [
      ['Report Type', 'Value'],
      ['Total Bookings', reportData.bookingStats.total],
      ['Approved Bookings', reportData.bookingStats.approved],
      ['Cancelled Bookings', reportData.bookingStats.cancelled],
      ['Upcoming Bookings', reportData.bookingStats.upcoming],
      ['Total Users', reportData.userStats.totalUsers],
      ['New Users This Month', reportData.userStats.newUsersThisMonth],
      ['Active Users', reportData.userStats.activeUsers],
      ['', ''],
      ['Court', 'Bookings'],
      ...reportData.courtStats.map(stat => [stat.courtName, stat.bookings])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No report data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">View booking statistics and generate reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-blue-600">
                {reportData.bookingStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-green-600">
                {reportData.bookingStats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {reportData.bookingStats.upcoming}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-purple-600">
                {reportData.userStats.totalUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Bookings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Bookings</h3>
          <div className="space-y-2">
            {reportData.dailyBookings.slice(-7).map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {format(new Date(day.date), 'MMM dd')}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((day.count / Math.max(...reportData.dailyBookings.map(d => d.count))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {day.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Court Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Court Usage</h3>
          <div className="space-y-3">
            {reportData.courtStats.map((court) => (
              <div key={court.courtName} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{court.courtName}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((court.bookings / Math.max(...reportData.courtStats.map(c => c.bookings))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {court.bookings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {reportData.userStats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {reportData.userStats.newUsersThisMonth}
            </div>
            <div className="text-sm text-gray-600">New This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {reportData.userStats.activeUsers}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
        </div>
      </div>
    </div>
  )
}
