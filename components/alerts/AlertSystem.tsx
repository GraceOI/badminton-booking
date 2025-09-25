'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Clock, Info, X } from 'lucide-react'

export interface Alert {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id'>) => void
  removeAlert: (id: string) => void
  clearAllAlerts: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newAlert: Alert = { ...alert, id }
    
    setAlerts(prev => [...prev, newAlert])

    // Auto remove after duration (default 5 seconds)
    if (!alert.persistent) {
      const duration = alert.duration || 5000
      setTimeout(() => {
        removeAlert(id)
      }, duration)
    }
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAllAlerts }}>
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

function AlertContainer({ alerts, onRemove }: { alerts: Alert[], onRemove: (id: string) => void }) {
  if (alerts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map(alert => (
        <AlertItem key={alert.id} alert={alert} onRemove={onRemove} />
      ))}
    </div>
  )
}

function AlertItem({ alert, onRemove }: { alert: Alert, onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (alert.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (alert.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div className={`p-4 rounded-lg border shadow-lg ${getBackgroundColor()} animate-in slide-in-from-right-5 duration-300`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${getTextColor()}`}>
            {alert.title}
          </h4>
          <p className={`text-sm mt-1 ${getTextColor()}`}>
            {alert.message}
          </p>
        </div>
        <button
          onClick={() => onRemove(alert.id)}
          className={`flex-shrink-0 ${getTextColor()} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Booking specific alerts
export function useBookingAlerts() {
  const { addAlert } = useAlert()

  const showBookingSuccess = (courtName: string, date: string, time: string) => {
    addAlert({
      type: 'success',
      title: 'Booking Confirmed! 🎾',
      message: `Successfully booked ${courtName} on ${date} at ${time}`,
      duration: 6000
    })
  }

  const showBookingError = (message: string) => {
    addAlert({
      type: 'error',
      title: 'Booking Failed',
      message: message,
      duration: 8000
    })
  }

  const showTimeWarning = (courtName: string, minutesLeft: number) => {
    addAlert({
      type: 'warning',
      title: 'Time Running Out! ⏰',
      message: `${courtName} booking expires in ${minutesLeft} minutes`,
      duration: 10000,
      persistent: minutesLeft <= 5
    })
  }

  const showBookingCancelled = (courtName: string) => {
    addAlert({
      type: 'info',
      title: 'Booking Cancelled',
      message: `${courtName} booking has been cancelled`,
      duration: 5000
    })
  }

  return {
    showBookingSuccess,
    showBookingError,
    showTimeWarning,
    showBookingCancelled
  }
}
