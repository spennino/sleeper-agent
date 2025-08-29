'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SleeperAPI } from '@/lib/sleeper-api'
import { SleeperUser, SleeperLeague } from '@/types/sleeper'
import LeagueSelector from '@/components/LeagueSelector'
import UsernameInput from '@/components/UsernameInput'

export default function UserPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  
  const [user, setUser] = useState<SleeperUser | null>(null)
  const [leagues, setLeagues] = useState<SleeperLeague[]>([])
  const [currentSeason, setCurrentSeason] = useState('2025')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        
        const [nflState, userData] = await Promise.all([
          SleeperAPI.getNFLState(),
          SleeperAPI.getUser(username)
        ])
        
        if (nflState) {
          setCurrentSeason(nflState.season)
        }
        
        if (!userData) {
          setError('User not found')
          return
        }
        
        setUser(userData)
        
        const userLeagues = await SleeperAPI.getUserLeagues(userData.user_id, nflState?.season || '2025')
        setLeagues(userLeagues)
        
        // If only one league, redirect directly to it
        if (userLeagues.length === 1) {
          router.push(`/league/${userLeagues[0].league_id}`)
        }
      } catch (err) {
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    
    if (username) {
      loadUserData()
    }
  }, [username, router])

  const handleLeagueSelect = (league: SleeperLeague) => {
    router.push(`/league/${league.league_id}`)
  }

  const handleUserChange = (newUser: SleeperUser) => {
    router.push(`/user/${newUser.username}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <UsernameInput onUserLoaded={handleUserChange} currentSeason={currentSeason} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome, {user?.display_name || user?.username}!
          </h1>
          <div className="text-sm text-gray-400">
            <button
              onClick={() => router.push('/')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Change user
            </button>
          </div>
        </div>
        <LeagueSelector
          leagues={leagues}
          selectedLeague={null}
          onLeagueSelect={handleLeagueSelect}
        />
      </div>
    </main>
  )
}