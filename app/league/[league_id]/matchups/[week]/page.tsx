'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SleeperAPI } from '@/lib/sleeper-api'
import { SleeperLeague, SleeperRoster, SleeperUser, SleeperMatchup } from '@/types/sleeper'
import Matchups from '@/components/Matchups'
import Navigation from '@/components/Navigation'

export default function MatchupsPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.league_id as string
  const week = parseInt(params.week as string)
  
  const [league, setLeague] = useState<SleeperLeague | null>(null)
  const [rosters, setRosters] = useState<SleeperRoster[]>([])
  const [users, setUsers] = useState<SleeperUser[]>([])
  const [matchups, setMatchups] = useState<SleeperMatchup[]>([])
  const [players, setPlayers] = useState<Record<string, any>>({})
  const [currentWeek, setCurrentWeek] = useState(week)
  const [nflCurrentWeek, setNflCurrentWeek] = useState<number>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMatchupData = async () => {
      try {
        setLoading(true)
        
        const [nflState, leagueInfo, leagueRosters, leagueUsers, weekMatchups, nflPlayers] = await Promise.all([
          SleeperAPI.getNFLState(),
          SleeperAPI.getLeague(leagueId),
          SleeperAPI.getLeagueRosters(leagueId),
          SleeperAPI.getLeagueUsers(leagueId),
          SleeperAPI.getMatchups(leagueId, week),
          SleeperAPI.getNFLPlayers()
        ])
        
        if (nflState) {
          setNflCurrentWeek(nflState.week)
          if (!week) {
            setCurrentWeek(nflState.week)
          }
        }
        
        setRosters(leagueRosters)
        setUsers(leagueUsers)
        setMatchups(weekMatchups)
        
        if (nflPlayers) {
          setPlayers(nflPlayers)
        }
        
        // Set league info from API response
        if (leagueInfo) {
          setLeague(leagueInfo)
        }
      } catch (err) {
        setError('Failed to load matchup data')
      } finally {
        setLoading(false)
      }
    }
    
    if (leagueId && week) {
      loadMatchupData()
    }
  }, [leagueId, week])

  const handleTabChange = (tab: 'standings' | 'matchups') => {
    if (tab === 'standings') {
      router.push(`/league/${leagueId}`)
    }
  }

  const handleWeekChange = (newWeek: number) => {
    router.push(`/league/${leagueId}/matchups/${newWeek}`)
  }

  const handleMatchupClick = (matchupId: number) => {
    router.push(`/league/${leagueId}/matchup/${week}/${matchupId}`)
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Matchups Not Found</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{league?.name || 'Loading...'}</h1>
            <p className="text-gray-400">Season {league?.season || '2025'}</p>
          </div>
          <div className="text-sm text-gray-400 space-x-4">
            <button
              onClick={() => router.push('/')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Change League
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('sleeper_username')
                router.push('/')
              }}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Change User
            </button>
          </div>
        </div>

        <Navigation
          activeTab="matchups"
          onTabChange={handleTabChange}
          week={week}
          onWeekChange={handleWeekChange}
        />

        <Matchups
          matchups={matchups}
          rosters={rosters}
          users={users}
          week={week}
          league={league}
          players={players}
          currentWeek={nflCurrentWeek}
          onMatchupClick={handleMatchupClick}
        />
      </div>
    </main>
  )
}