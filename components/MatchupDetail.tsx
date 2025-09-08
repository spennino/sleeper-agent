'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SleeperMatchup, SleeperRoster, SleeperUser, SleeperLeague } from '@/types/sleeper'
import { createBestBallMatchup, isBestBallLeague } from '@/lib/best-ball'

interface MatchupDetailProps {
  matchups: SleeperMatchup[]
  rosters: SleeperRoster[]
  users: SleeperUser[]
  matchupId: number
  week: number
  players: Record<string, any>
  league: SleeperLeague | null
  currentWeek?: number
  onBack: () => void
}

export default function MatchupDetail({ matchups, rosters, users, matchupId, week, players, league, currentWeek, onBack }: MatchupDetailProps) {
  const [liveTeams, setLiveTeams] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadLiveTeams = async () => {
      try {
        const res = await fetch('/api/live-teams')
        if (!res.ok) return
        const data = await res.json()
        setLiveTeams(new Set<string>(data.teams || []))
      } catch (err) {
        console.error('Failed to fetch live teams', err)
      }
    }

    loadLiveTeams()
    const interval = setInterval(loadLiveTeams, 60000)
    return () => clearInterval(interval)
  }, [])

  // Apply best ball logic if this is a best ball league
  const processedMatchups = matchups.map(matchup =>
    createBestBallMatchup(matchup, players, league)
  )

  const matchupTeams = processedMatchups.filter(m => m.matchup_id === matchupId)
  
  const getUserByRosterId = (rosterId: number) => {
    const roster = rosters.find(r => r.roster_id === rosterId)
    if (!roster) return null
    return users.find(user => user.user_id === roster.owner_id)
  }

  if (matchupTeams.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-4">Matchup not found</p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Back to Matchups
        </button>
      </div>
    )
  }

  const team1 = matchupTeams[0]
  const team2 = matchupTeams[1]
  const user1 = getUserByRosterId(team1.roster_id)
  const user2 = team2 ? getUserByRosterId(team2.roster_id) : null
  const avatar1 = user1?.metadata?.avatar || user1?.avatar
  const avatar2 = user2?.metadata?.avatar || user2?.avatar

  // Determine if the matchup is completed
  // A matchup is considered complete if it's from a past week, or if it has a clear winner with different points
  const isMatchupComplete = currentWeek ? week < currentWeek : (team1.points !== team2?.points && (team1.points > 0 || team2?.points > 0))

  const renderPlayerPoints = (matchup: SleeperMatchup) => {
    const starterIds = new Set(matchup.starters)
    const isBestBall = isBestBallLeague(league)
    
    const renderPlayer = (playerId: string, points: number, isStarter: boolean = false) => {
      const player = players[playerId]
      if (!player && !playerId) {
        return (
          <div className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded">
            <span className="text-sm text-gray-400">Empty Slot</span>
            <span className="font-medium">0.00</span>
          </div>
        )
      }
      
      if (!player) {
        return (
          <div className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded">
            <span className="text-sm">{playerId}</span>
            <span className="font-medium">{points?.toFixed(2) || '0.00'}</span>
          </div>
        )
      }
      
      return (
        <div className={`flex items-center justify-between py-2 px-3 rounded ${isStarter ? 'bg-gray-700' : 'bg-gray-800'}`}>
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
              {player.first_name?.[0]}{player.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {player.full_name || `${player.first_name} ${player.last_name}`}
              </div>
              <div className="text-xs text-gray-400">
                {player.position} • {player.team || 'FA'}
                {player.team && liveTeams.has(player.team) && (
                  <span className="ml-2 inline-flex items-center text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1" />
                    LIVE
                  </span>
                )}
                {player.injury_status && player.injury_status !== 'Healthy' && (
                  <span className="text-red-400 ml-1">({player.injury_status})</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{points?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-sm text-gray-300 mb-3 flex items-center gap-2">
            {isBestBall ? 'Best Ball Lineup' : 'Starters'}
            {isBestBall && <span className="text-xs bg-blue-600 px-2 py-1 rounded">AUTO</span>}
          </h4>
          <div className="space-y-2">
            {matchup.starters.map((playerId, index) => 
              <div key={`starter-${playerId}-${index}`}>
                {renderPlayer(playerId, matchup.starters_points[index], true)}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-gray-300 mb-3 pt-2">Bench</h4>
          <div className="space-y-2">
            {matchup.players
              .filter(playerId => !starterIds.has(playerId))
              .map((playerId) => 
                <div key={`bench-${playerId}`}>
                  {renderPlayer(playerId, matchup.players_points[playerId], false)}
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }

  if (!team2) {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-6 text-blue-400 hover:text-blue-300 underline"
        >
          ← Back to Matchups
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Week {week} - BYE WEEK</h2>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              {avatar1 && (
                <Image
                  src={`https://sleepercdn.com/avatars/${avatar1}`}
                  alt={user1?.display_name || user1?.username || 'User'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user1?.metadata?.team_name || user1?.display_name || user1?.username || 'Unknown'}
                </h3>
                {user1?.metadata?.team_name && (
                  <div className="text-sm text-gray-400">
                    {user1?.display_name || user1?.username}
                  </div>
                )}
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">{team1.points.toFixed(2)}</p>
            <p className="text-gray-400">BYE WEEK</p>
          </div>
          
          {renderPlayerPoints(team1)}
        </div>
      </div>
    )
  }

  const winner = team1.points > team2.points ? team1 : team2.points > team1.points ? team2 : null

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-blue-400 hover:text-blue-300 underline"
      >
        ← Back to Matchups
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Week {week} Matchup</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`bg-gray-800 rounded-lg p-6 ${winner?.roster_id === team1.roster_id ? 'ring-2 ring-green-400' : ''}`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              {avatar1 && (
                <Image
                  src={`https://sleepercdn.com/avatars/${avatar1}`}
                  alt={user1?.display_name || user1?.username || 'User'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user1?.metadata?.team_name || user1?.display_name || user1?.username || 'Unknown'}
                </h3>
                {user1?.metadata?.team_name && (
                  <div className="text-sm text-gray-400">
                    {user1?.display_name || user1?.username}
                  </div>
                )}
              </div>
            </div>
            <p className={`text-3xl font-bold ${winner?.roster_id === team1.roster_id ? 'text-green-400' : ''}`}>
              {team1.points.toFixed(2)}
            </p>
            {winner?.roster_id === team1.roster_id && isMatchupComplete && (
              <p className="text-green-400 font-medium">WINNER</p>
            )}
          </div>
          
          {renderPlayerPoints(team1)}
        </div>
        
        <div className={`bg-gray-800 rounded-lg p-6 ${winner?.roster_id === team2.roster_id ? 'ring-2 ring-green-400' : ''}`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              {avatar2 && (
                <Image
                  src={`https://sleepercdn.com/avatars/${avatar2}`}
                  alt={user2?.display_name || user2?.username || 'User'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user2?.metadata?.team_name || user2?.display_name || user2?.username || 'Unknown'}
                </h3>
                {user2?.metadata?.team_name && (
                  <div className="text-sm text-gray-400">
                    {user2?.display_name || user2?.username}
                  </div>
                )}
              </div>
            </div>
            <p className={`text-3xl font-bold ${winner?.roster_id === team2.roster_id ? 'text-green-400' : ''}`}>
              {team2.points.toFixed(2)}
            </p>
            {winner?.roster_id === team2.roster_id && isMatchupComplete && (
              <p className="text-green-400 font-medium">WINNER</p>
            )}
          </div>
          
          {renderPlayerPoints(team2)}
        </div>
      </div>
    </div>
  )
}