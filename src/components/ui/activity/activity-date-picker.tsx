'use client'

import React, { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

interface ActivityDatePickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  className?: string
  disabled?: boolean
}

export default function ActivityDatePicker({
  selectedDate,
  onDateChange,
  className = '',
  disabled = false
}: Readonly<ActivityDatePickerProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDate, setTempDate] = useState(selectedDate)

  const today = new Date()
  const maxDate = today.toISOString().split('T')[0]
  const minDate = new Date(today.getFullYear() - 1, 0, 1).toISOString().split('T')[0]

  const handleDateChange = (dateString: string) => {
    const newDate = new Date(dateString)
    setTempDate(newDate)
  }

  const handleConfirm = () => {
    onDateChange(tempDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempDate(selectedDate)
    setIsOpen(false)
  }

  const formatDisplayDate = (date: Date) => {
    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString()

    if (isToday) return 'Today'
    if (isYesterday) return 'Yesterday'

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!disabled) {
              setIsOpen(!isOpen)
            }
          }
        }}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
          text-sm text-gray-300 hover:bg-gray-700 hover:border-gray-600
          transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'bg-gray-700 border-gray-600' : ''}
        `}
      >
        <Calendar className="w-4 h-4" />
        <span>{formatDisplayDate(selectedDate)}</span>
        <Clock className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={handleCancel}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel()
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close date picker"
          />

          {/* Date picker modal */}
          <div className="absolute top-full left-0 mt-2 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 min-w-64">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white mb-2">
                Select Activity Date
              </h3>
              <p className="text-xs text-gray-400">
                Choose the date when this activity occurred
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="activity-date-input" className="block text-xs font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                id="activity-date-input"
                type="date"
                value={tempDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="activity-time-input" className="block text-xs font-medium text-gray-300 mb-2">
                Time (Optional)
              </label>
              <input
                id="activity-time-input"
                type="time"
                value={tempDate.toTimeString().slice(0, 5)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':')
                  const newDate = new Date(tempDate)
                  newDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0)
                  setTempDate(newDate)
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
