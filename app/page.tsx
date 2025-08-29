'use client'

import { useState, useEffect } from 'react'
import { SleeperAPI } from '@/lib/sleeper-api'
import { SleeperUser, SleeperLeague, SleeperRoster, SleeperMatchup } from '@/types/sleeper'
import UsernameInput from '@/components/UsernameInput'
import LeagueSelector from '@/components/LeagueSelector'
import Standings from '@/components/Standings'
import Matchups from '@/components/Matchups'
import MatchupDetail from '@/components/MatchupDetail'
import Navigation from '@/components/Navigation'

type View = 'standings' | 'matchups' | 'matchup-detail'

export default function Home() {
  const [user, setUser] = useState<SleeperUser | null>(null)
  const [leagues, setLeagues] = useState<SleeperLeague[]>([])
  const [selectedLeague, setSelectedLeague] = useState<SleeperLeague | null>(null)
  const [rosters, setRosters] = useState<SleeperRoster[]>([])
  const [users, setUsers] = useState<SleeperUser[]>([])
  const [matchups, setMatchups] = useState<SleeperMatchup[]>([])
  const [currentView, setCurrentView] = useState<View>('standings')
  const [selectedMatchupId, setSelectedMatchupId] = useState<number | null>(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getCurrentWeek = async () => {
      const nflState = await SleeperAPI.getNFLState()
      if (nflState) {
        setCurrentWeek(nflState.week)
      }
    }
    getCurrentWeek()
  }, [])

  const handleUserLoaded = (loadedUser: SleeperUser, loadedLeagues: SleeperLeague[]) => {
    setUser(loadedUser)
    setLeagues(loadedLeagues)
    if (loadedLeagues.length === 1) {
      setSelectedLeague(loadedLeagues[0])
    }
  }

  const handleLeagueSelect = async (league: SleeperLeague) => {
    setSelectedLeague(league)
    setLoading(true)
    
    try {
      const [leagueRosters, leagueUsers, leagueMatchups] = await Promise.all([
        SleeperAPI.getLeagueRosters(league.league_id),
        SleeperAPI.getLeagueUsers(league.league_id),
        SleeperAPI.getMatchups(league.league_id, currentWeek)
      ])
      
      setRosters(leagueRosters)
      setUsers(leagueUsers)
      setMatchups(leagueMatchups)
    } catch (error) {
      console.error('Error loading league data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: 'standings' | 'matchups') => {
    setCurrentView(tab)
    setSelectedMatchupId(null)
  }

  const handleWeekChange = async (week: number) => {
    if (!selectedLeague) return
    
    setCurrentWeek(week)
    setLoading(true)
    
    try {
      const leagueMatchups = await SleeperAPI.getMatchups(selectedLeague.league_id, week)
      setMatchups(leagueMatchups)
    } catch (error) {
      console.error('Error loading matchups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMatchupClick = (matchupId: number) => {
    setSelectedMatchupId(matchupId)
    setCurrentView('matchup-detail')
  }

  const handleBackToMatchups = () => {
    setSelectedMatchupId(null)
    setCurrentView('matchups')
  }

  if (!user) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Sleeper Agent
            </h1>
            <p className="text-gray-400 text-lg">
              Your fantasy football command center
            </p>
          </div>
          <UsernameInput onUserLoaded={handleUserLoaded} />
        </div>
      </main>
    )
  }

  if (!selectedLeague) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Welcome, {user.display_name || user.username}!
            </h1>
            <UsernameInput onUserLoaded={handleUserLoaded} />
          </div>
          <LeagueSelector
            leagues={leagues}
            selectedLeague={selectedLeague}
            onLeagueSelect={handleLeagueSelect}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{selectedLeague.name}</h1>
            <p className="text-gray-400">Season {selectedLeague.season}</p>
          </div>
          <div className="text-sm text-gray-400">
            <button
              onClick={() => setSelectedLeague(null)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Change League
            </button>
            {' • '}
            <UsernameInput onUserLoaded={handleUserLoaded} />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}

        {!loading && currentView !== 'matchup-detail' && (
          <Navigation
            activeTab={currentView === 'standings' ? 'standings' : 'matchups'}
            onTabChange={handleTabChange}
            week={currentWeek}
            onWeekChange={handleWeekChange}
          />
        )}

        {!loading && currentView === 'standings' && (
          <Standings rosters={rosters} users={users} />
        )}

        {!loading && currentView === 'matchups' && (
          <Matchups
            matchups={matchups}
            rosters={rosters}
            users={users}
            week={currentWeek}
            onMatchupClick={handleMatchupClick}
          />
        )}

        {!loading && currentView === 'matchup-detail' && selectedMatchupId !== null && (
          <MatchupDetail
            matchups={matchups}
            rosters={rosters}
            users={users}
            matchupId={selectedMatchupId}
            week={currentWeek}
            onBack={handleBackToMatchups}
          />
        )}
      </div>
    </main>
  )
}