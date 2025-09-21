'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import MovieDetailPanel from './movie-detail-panel'
import { MovieDetail } from './types'

interface HeatmapData {
  activities: Record<string, MovieDetail[]>
  startOfMonth: string
  endOfMonth: string
}

interface ActivityHeatmapProps {
  className?: string
}

export default function ActivityHeatmap({
  className = '',
}: Readonly<ActivityHeatmapProps>) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [data, setData] = React.useState<HeatmapData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [selectedMovies, setSelectedMovies] = React.useState<MovieDetail[]>([])
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  React.useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchHeatmapData = async () => {
      try {
        const response = await fetch(
          `/api/activity/heatmap?month=${currentMonth.toISOString()}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch heatmap data')
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching heatmap data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeatmapData()
  }, [userId, currentMonth])

  const handleDateClick = (dateStr: string, movies: MovieDetail[]) => {
    setSelectedDate(dateStr)
    setSelectedMovies(movies)
  }

  const closeModal = () => {
    setSelectedDate(null)
    setSelectedMovies([])
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  if (loading) {
    return (
      <div className={`activity-heatmap ${className}`}>
        <div className="bg-gray-100 rounded p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={`loading-skeleton-${i}`}
                className="w-8 h-8 bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className={`activity-heatmap ${className}`}>
        <div className="text-center text-gray-500 py-4">
          Please log in to view activity calendar
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={`activity-heatmap ${className}`}>
        <div className="text-center text-gray-500 py-4">No activity data</div>
      </div>
    )
  }

  const generateCalendarGrid = () => {
    const startDate = new Date(data.startOfMonth)
    const endDate = new Date(data.endOfMonth)
    const today = new Date()

    const grid = []
    const currentDate = new Date(startDate)

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = startDate.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.push({ date: null, count: 0, movies: [], isToday: false })
    }

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const movies = data.activities[dateStr] || []
      const count = movies.length
      const isToday = currentDate.toDateString() === today.toDateString()

      grid.push({
        date: new Date(currentDate),
        dateStr,
        count,
        movies,
        isToday,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return grid
  }

  const calendarGrid = generateCalendarGrid()

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count === 1) return 'bg-blue-100'
    if (count === 2) return 'bg-blue-200'
    if (count >= 3) return 'bg-blue-300'
    return 'bg-gray-100'
  }

  return (
    <div className={`activity-heatmap ${className}`}>
      <div className="bg-gray-100 rounded p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="px-3 py-1 bg-gray-200 rounded text-gray-800 hover:bg-gray-300"
          >
            ← Previous
          </button>
          <h3 className="text-lg font-semibold text-gray-800">
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <button
            onClick={goToNextMonth}
            className="px-3 py-1 bg-gray-200 rounded text-gray-800 hover:bg-gray-300"
          >
            Next →
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((day, index) => (
            <button
              key={`day-${day.date?.toISOString() || index}`}
              onClick={() =>
                day.date && handleDateClick(day.dateStr, day.movies)
              }
              disabled={!day.date}
              className={`
                h-8 text-sm font-medium rounded
                ${day.date ? getIntensityClass(day.count) : 'bg-gray-50'}
                ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                ${
                  day.date
                    ? 'cursor-pointer hover:brightness-90'
                    : 'cursor-default'
                }
              `}
              title={
                day.date
                  ? `${day.date.toLocaleDateString()}: ${
                      day.count
                    } movies watched`
                  : ''
              }
            >
              <div className="flex items-center justify-center h-full">
                {day.date ? day.date.getDate() : ''}
              </div>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <div className="w-3 h-3 bg-blue-300 rounded"></div>
          </div>
          <span>More</span>
        </div>

        {/* Modal */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="bg-white rounded p-4 max-w-sm w-full max-h-[70vh] overflow-auto">
              <MovieDetailPanel
                date={selectedDate}
                movies={selectedMovies}
                onClose={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
