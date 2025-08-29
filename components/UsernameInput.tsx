'use client'

import { useState, useEffect } from 'react'
import { SleeperAPI } from '@/lib/sleeper-api'
import { SleeperUser, SleeperLeague } from '@/types/sleeper'

interface UsernameInputProps {
  onUserLoaded: (user: SleeperUser, leagues: SleeperLeague[]) => void
}

export default function UsernameInput({ onUserLoaded }: UsernameInputProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedUsername, setSavedUsername] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('sleeper_username')
    if (saved) {
      setSavedUsername(saved)
      handleSubmit(null, saved)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent | null, usernameToUse?: string) => {
    if (e) e.preventDefault()
    
    const usernameValue = usernameToUse || username.trim()
    if (!usernameValue) {
      setError('Please enter a username')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const user = await SleeperAPI.getUser(usernameValue)
      if (!user) {
        setError('User not found. Please check the username.')
        return
      }

      const leagues = await SleeperAPI.getUserLeagues(user.user_id)
      
      localStorage.setItem('sleeper_username', usernameValue)
      setSavedUsername(usernameValue)
      onUserLoaded(user, leagues)
    } catch (error) {
      setError('Failed to load user data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUsername = () => {
    setSavedUsername('')
    localStorage.removeItem('sleeper_username')
    setUsername('')
    setError('')
  }

  if (savedUsername && !error) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-2">Logged in as:</p>
        <p className="text-xl font-semibold mb-4">{savedUsername}</p>
        <button
          onClick={handleEditUsername}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Change username
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Enter your Sleeper username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="sleeper_username"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load My Leagues'}
        </button>
      </form>
    </div>
  )
}