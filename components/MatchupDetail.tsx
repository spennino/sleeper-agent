'use client'

import Image from 'next/image'
import { SleeperMatchup, SleeperRoster, SleeperUser } from '@/types/sleeper'

interface MatchupDetailProps {
  matchups: SleeperMatchup[]
  rosters: SleeperRoster[]
  users: SleeperUser[]
  matchupId: number
  week: number
  onBack: () => void
}

export default function MatchupDetail({ matchups, rosters, users, matchupId, week, onBack }: MatchupDetailProps) {
  const matchupTeams = matchups.filter(m => m.matchup_id === matchupId)
  
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

  const renderPlayerPoints = (matchup: SleeperMatchup) => {
    const starterIds = new Set(matchup.starters)
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-300 mb-2">Starters</h4>
        {matchup.starters.map((playerId, index) => (
          <div key={`starter-${playerId}-${index}`} className="flex justify-between items-center py-1">
            <span className="text-sm">
              {playerId || 'Empty Slot'}
            </span>
            <span className="font-medium">
              {matchup.starters_points[index]?.toFixed(2) || '0.00'}
            </span>
          </div>
        ))}
        
        <h4 className="font-semibold text-sm text-gray-300 mb-2 pt-2">Bench</h4>
        {matchup.players
          .filter(playerId => !starterIds.has(playerId))
          .map((playerId) => (
            <div key={`bench-${playerId}`} className="flex justify-between items-center py-1 text-gray-400">
              <span className="text-sm">
                {playerId}
              </span>
              <span className="font-medium">
                {matchup.players_points[playerId]?.toFixed(2) || '0.00'}
              </span>
            </div>
          ))}
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
              {user1?.avatar && (
                <Image
                  src={`https://sleepercdn.com/avatars/${user1.avatar}`}
                  alt={user1.display_name || user1.username || 'User'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <h3 className="text-xl font-semibold">
                {user1?.display_name || user1?.username || 'Unknown'}
              </h3>
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
              {user1?.avatar && (
                <Image
                  src={`https://sleepercdn.com/avatars/${user1.avatar}`}
                  alt={user1.display_name || user1.username || 'User'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <h3 className="text-xl font-semibold">
                {user1?.display_name || user1?.username || 'Unknown'}
              </h3>
            </div>
            <p className={`text-3xl font-bold ${winner?.roster_id === team1.roster_id ? 'text-green-400' : ''}`}>
              {team1.points.toFixed(2)}
            </p>
            {winner?.roster_id === team1.roster_id && (
              <p className="text-green-400 font-medium">WINNER</p>
            )}
          </div>
          
          {renderPlayerPoints(team1)}
        </div>
        
        <div className={`bg-gray-800 rounded-lg p-6 ${winner?.roster_id === team2.roster_id ? 'ring-2 ring-green-400' : ''}`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              {user2?.avatar && (
                <Image
                  src={`https://sleepercdn.com/avatars/${user2.avatar}`}
                  alt={user2.display_name || user2.username || 'User'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <h3 className="text-xl font-semibold">
                {user2?.display_name || user2?.username || 'Unknown'}
              </h3>
            </div>
            <p className={`text-3xl font-bold ${winner?.roster_id === team2.roster_id ? 'text-green-400' : ''}`}>
              {team2.points.toFixed(2)}
            </p>
            {winner?.roster_id === team2.roster_id && (
              <p className="text-green-400 font-medium">WINNER</p>
            )}
          </div>
          
          {renderPlayerPoints(team2)}
        </div>
      </div>
    </div>
  )
}