'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SleeperAPI } from '@/lib/sleeper-api'
import { SleeperLeague, SleeperRoster, SleeperUser, SleeperMatchup } from '@/types/sleeper'
import MatchupDetail from '@/components/MatchupDetail'

export default function MatchupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.league_id as string
  const week = parseInt(params.week as string)
  const matchupId = parseInt(params.matchup_id as string)
  
  const [rosters, setRosters] = useState<SleeperRoster[]>([])
  const [users, setUsers] = useState<SleeperUser[]>([])
  const [matchups, setMatchups] = useState<SleeperMatchup[]>([])
  const [players, setPlayers] = useState<Record<string, any>>({})
  const [league, setLeague] = useState<SleeperLeague | null>(null)
  const [currentWeek, setCurrentWeek] = useState<number>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMatchupDetailData = async () => {
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
          setCurrentWeek(nflState.week)
        }
        
        setRosters(leagueRosters)
        setUsers(leagueUsers)
        setMatchups(weekMatchups)
        setLeague(leagueInfo)
        
        if (nflPlayers) {
          setPlayers(nflPlayers)
        }
      } catch (err) {
        setError('Failed to load matchup details')
      } finally {
        setLoading(false)
      }
    }
    
    if (leagueId && week && matchupId) {
      loadMatchupDetailData()
    }
  }, [leagueId, week, matchupId])

  const handleBack = () => {
    router.push(`/league/${leagueId}/matchups/${week}`)
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
            <h1 className="text-4xl font-bold mb-4">Matchup Not Found</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Back to Matchups
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <MatchupDetail
          matchups={matchups}
          rosters={rosters}
          users={users}
          matchupId={matchupId}
          week={week}
          players={players}
          league={league}
          currentWeek={currentWeek}
          onBack={handleBack}
        />
      </div>
    </main>
  )
}