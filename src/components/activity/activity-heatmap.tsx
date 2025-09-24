'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import MovieDetailPanel from './movie-detail-panel'
import { MovieDetail } from './types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

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
  const today = new Date()
  const debouncedMonth = useDebounce(currentMonth, 400)

  React.useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchHeatmapData = async () => {
      try {
        const response = await fetch(
          `/api/activity/heatmap?month=${debouncedMonth.toISOString()}`
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

    // Show loading state when refetching (e.g., when month changes)
    setLoading(true)
    fetchHeatmapData()
  }, [userId, debouncedMonth])

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

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  if (loading) {
    return (
      <div className={`activity-heatmap ${className}`}>
        <div className="bg-dark-gray-2 p-4 animate-pulse">
          <div className="h-6 ml-auto bg-dark-gray mb-4 w-32"></div>
          <div className="h-[250px] md:h-[300px] w-full bg-dark-gray"></div>
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
    if (count === 0) return 'bg-dark-gray'
    if (count === 1) return 'bg-light-green/50'
    if (count === 2) return 'bg-light-green/70'
    if (count >= 3) return 'bg-light-green'
    return 'bg-light-green'
  }

  return (
    <div className={`activity-heatmap ${className}`}>
      <div className="bg-dark-gray-2">
        {/* Header */}
        <div className="flex items-center justify-end pt-4 px-4 mb-6 gap-2">
          <h3 className="text-lg font-semibold mr-2">
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <button
            onClick={goToCurrentMonth}
            className="px-2 py-1 bg-dark-gray text-sm hover:bg-dark-gray-hover"
            disabled={
              currentMonth.getFullYear() === today.getFullYear() &&
              currentMonth.getMonth() === today.getMonth()
            }
          >
            Today
          </button>
          <button onClick={goToPreviousMonth} className="p-1 bg-dark-gray ">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={goToNextMonth} className="p-1 bg-dark-gray ">
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarGrid.map((day, index) => (
            <button
              key={`day-${day.date?.toISOString() || index}`}
              onClick={() =>
                day.date && handleDateClick(day.dateStr, day.movies)
              }
              disabled={!day.date}
              className={`
                p-3 md:p-5 text-sm
                ${day.date ? getIntensityClass(day.count) : 'bg-dark-gray-2'}
                ${day.isToday ? 'bg-dark-gray-hover' : ''}
                ${day.date ? 'cursor-pointer' : 'cursor-default'}
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

        {/* Modal */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="bg-dark-gray-2 p-4 max-w-sm w-full max-h-[70vh] overflow-auto">
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
